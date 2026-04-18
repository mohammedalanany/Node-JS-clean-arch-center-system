import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares/error.middleware';
import { groupService } from './group.service';

const getCenterId = (req: Request): number => (req.user as any).centerId;

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiGetGroups = asyncHandler(async (req: Request, res: Response) => {
  const groups = await groupService.getAll(getCenterId(req));
  res.json({ success: true, data: groups });
});

export const apiGetGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await groupService.getById(Number(req.params.id), getCenterId(req));
  res.json({ success: true, data: group });
});

export const apiCreateGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await groupService.create(req.body, getCenterId(req));
  res.status(201).json({ success: true, data: group });
});

export const apiUpdateGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await groupService.update(Number(req.params.id), getCenterId(req), req.body);
  res.json({ success: true, data: group });
});

export const apiDeleteGroup = asyncHandler(async (req: Request, res: Response) => {
  await groupService.delete(Number(req.params.id), getCenterId(req));
  res.json({ success: true, message: 'تم حذف المجموعة بنجاح' });
});

export const apiEnrollStudent = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.body;
  const group = await groupService.enrollStudent(Number(req.params.id), getCenterId(req), Number(studentId));
  res.json({ success: true, data: group });
});

export const apiRemoveStudent = asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.body;
  await groupService.removeStudent(Number(req.params.id), getCenterId(req), Number(studentId));
  res.json({ success: true, message: 'تم إزالة الطالب من المجموعة' });
});

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderGroups = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const groups = await groupService.getAll(centerId);
  res.render('pages/center-groups', {
    title: 'إدارة المجموعات',
    user: req.user,
    groups,
  });
});

import { studentService } from '../students/student.service';
import { paymentService } from '../payments/payment.service';
import { PaymentStatus } from '../payments/payment.entity';

// ... (existing API controllers)

export const renderGroupDetail = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const groupId = Number(req.params.id);

  const group = await groupService.getById(groupId, centerId);
  const [allStudents, payments] = await Promise.all([
    groupService.getAllStudents(centerId, group),
    paymentService.getByGroup(groupId, centerId),
  ]);

  // Calculate financials for this group
  const totalRevenue = payments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const totalPending = payments
    .filter(p => p.status !== PaymentStatus.PAID)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  res.render('pages/group-detail', {
    title: `مجموعة: ${group.name}`,
    user: req.user,
    group,
    allStudents,
    financials: { totalRevenue, totalPending },
  });
});
