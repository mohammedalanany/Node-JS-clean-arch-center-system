import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares/error.middleware';

// ── Center Management View Controllers ────────────────────────────────────────


export const renderCenterExams = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.centerId) return res.redirect('/');
  res.render('pages/center-exams', { title: 'الاختبارات - أكاديمي برو', user: req.user });
});

// ── Center Management View Controllers ────────────────────────────────────────



import { groupService } from '../groups/group.service';

export const renderCenterSchedule = asyncHandler(async (req: Request, res: Response) => {
  const centerId = req.user?.centerId;
  if (!centerId) return res.redirect('/');
  
  const groups = await groupService.getAll(centerId);
  
  res.render('pages/center-schedule', {
    title: 'الجدول الدراسي - أكاديمي برو',
    user: req.user,
    groups,
  });
});
