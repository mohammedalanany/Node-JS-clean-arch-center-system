import { Request, Response } from 'express';
import { centerService } from './center.service';
import { CenterRepository } from './center.repository';
import { StudentRepository } from '../students/student.repository';
import { GroupRepository } from '../groups/group.repository';
import { asyncHandler } from '../../shared/middlewares/error.middleware';

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderCentersList = asyncHandler(async (_req: Request, res: Response) => {
  const centers = await centerService.getAllCenters();
  res.render('pages/centers', { title: 'إدارة السناتر', centers });
});

export const renderAddCenter = (_req: Request, res: Response) => {
  res.render('pages/add-center', { title: 'إضافة سنتر جديد', error: null });
};

export const processAddCenter = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, address, phone, email } = req.body;
    if (!name) throw new Error('اسم السنتر مطلوب');
    await centerService.createCenter({ name, address, phone, email });
    res.redirect('/centers');
  } catch (err: any) {
    res.render('pages/add-center', { title: 'إضافة سنتر جديد', error: err.message });
  }
});

import { paymentService } from '../payments/payment.service';

// ... (existing view controllers)

export const renderDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role === 'superadmin') {
    const centers = await CenterRepository.findActiveCenters();
    return res.render('pages/superadmin', {
      title: 'لوحة التحكم الرئيسية',
      user: req.user,
      centers,
    });
  }

  const centerId = req.user?.centerId;
  if (!centerId) return res.redirect('/login');

  const [totalStudents, totalGroups, monthlyFinances] = await Promise.all([
    StudentRepository.countByCenter(centerId),
    GroupRepository.countByCenter(centerId),
    paymentService.getMonthlyRevenue(centerId),
  ]);

  res.render('pages/dashboard', {
    title: 'لوحة تحكم السنتر - أكاديمي برو',
    user: req.user,
    stats: {
      totalStudents,
      totalGroups,
      totalTeachers: 0, 
      monthlyRevenue: monthlyFinances.revenue,
      todayAttendance: 0 
    }
  });
});

export const renderSettings = asyncHandler(async (req: Request, res: Response) => {
  const centerId = req.user?.centerId;
  if (!centerId) return res.redirect('/login');
  const centerInfo = await centerService.getById(centerId);
  
  res.render('pages/center-settings', {
    title: 'إعدادات السنتر',
    user: req.user,
    centerInfo,
  });
});

export const apiUpdateSettings = asyncHandler(async (req: Request, res: Response) => {
  const centerId = req.user?.centerId;
  if (!centerId) throw new Error('غير مصرح');
  
  const updated = await centerService.updateCenter(centerId, req.body);
  res.json({ success: true, data: updated, message: 'تم تحديث الإعدادات بنجاح' });
});
