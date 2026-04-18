import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { PaymentStatus, PaymentMethod } from './payment.entity';
import { asyncHandler, createError } from '../../shared/middlewares/error.middleware';
import { studentService } from '../students/student.service';
import { groupService } from '../groups/group.service';

const getCenterId = (req: Request): number => {
  if (!req.user?.centerId) throw createError('Center context missing', 400);
  return req.user.centerId;
};

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderCenterPayments = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);

  const [payments, summary, students, groups, monthlyBreakdown, overdue] = await Promise.all([
    paymentService.getAll(centerId),
    paymentService.getSummary(centerId),
    studentService.getAll(centerId),
    groupService.getAll(centerId),
    paymentService.getMonthlyBreakdown(centerId),
    paymentService.getOverdue(centerId),
  ]);

  res.render('pages/center-payments', {
    title: 'إدارة المدفوعات - أكاديمي برو',
    user: req.user,
    payments,
    summary,
    students,
    groups,
    monthlyBreakdown,
    overdue,
    PaymentStatus,
    PaymentMethod,
  });
});

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiGetPayments = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const payments = await paymentService.getAll(centerId);
  res.json({ success: true, data: payments });
});

export const apiGetPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.getById(Number(req.params.id), getCenterId(req));
  res.json({ success: true, data: payment });
});

export const apiGetPaymentsByStudent = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const payments = await paymentService.getByStudent(Number(req.params.studentId), centerId);
  res.json({ success: true, data: payments });
});

export const apiGetPaymentsByGroup = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const payments = await paymentService.getByGroup(Number(req.params.groupId), centerId);
  res.json({ success: true, data: payments });
});

export const apiGetSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await paymentService.getSummary(getCenterId(req));
  res.json({ success: true, data: summary });
});

export const apiGetMonthlyRevenue = asyncHandler(async (req: Request, res: Response) => {
  const revenue = await paymentService.getMonthlyRevenue(getCenterId(req));
  res.json({ success: true, data: revenue });
});

export const apiGetMonthlyBreakdown = asyncHandler(async (req: Request, res: Response) => {
  const breakdown = await paymentService.getMonthlyBreakdown(getCenterId(req));
  res.json({ success: true, data: breakdown });
});

export const apiGetOverdue = asyncHandler(async (req: Request, res: Response) => {
  const overdue = await paymentService.getOverdue(getCenterId(req));
  res.json({ success: true, data: overdue });
});

export const apiCreatePayment = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const { studentId, groupId, amount, paidAmount, status, paymentMethod, dueDate, paidAt, notes, description } = req.body;

  if (!studentId || !amount || !dueDate) {
    res.status(400).json({ success: false, message: 'studentId, amount, dueDate مطلوبين' });
    return;
  }

  const payment = await paymentService.create(
    {
      studentId: Number(studentId),
      groupId: groupId ? Number(groupId) : undefined,
      amount: Number(amount),
      paidAmount: paidAmount ? Number(paidAmount) : undefined,
      status: status as PaymentStatus,
      paymentMethod: paymentMethod as PaymentMethod,
      dueDate,
      paidAt,
      notes,
      description,
    },
    centerId,
  );

  res.status(201).json({ success: true, data: payment });
});

export const apiUpdatePayment = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const { amount, paidAmount, status, paymentMethod, dueDate, paidAt, notes, description } = req.body;

  const payment = await paymentService.update(Number(req.params.id), centerId, {
    amount: amount !== undefined ? Number(amount) : undefined,
    paidAmount: paidAmount !== undefined ? Number(paidAmount) : undefined,
    status: status as PaymentStatus,
    paymentMethod: paymentMethod as PaymentMethod,
    dueDate,
    paidAt,
    notes,
    description,
  });

  res.json({ success: true, data: payment });
});

export const apiMarkAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const { paymentMethod } = req.body || {};
  const payment = await paymentService.markAsPaid(
    Number(req.params.id),
    getCenterId(req),
    paymentMethod as PaymentMethod,
  );
  res.json({ success: true, data: payment });
});

export const apiDeletePayment = asyncHandler(async (req: Request, res: Response) => {
  await paymentService.delete(Number(req.params.id), getCenterId(req));
  res.json({ success: true, message: 'تم حذف سجل الدفع بنجاح' });
});

// ── Bulk Operations ────────────────────────────────────────────────────────────

export const apiBulkCreateForGroup = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const { groupId, amount, dueDate, description } = req.body;

  if (!groupId || !amount || !dueDate) {
    res.status(400).json({ success: false, message: 'groupId, amount, dueDate مطلوبين' });
    return;
  }

  const payments = await paymentService.bulkCreateForGroup(
    Number(groupId),
    centerId,
    Number(amount),
    dueDate,
    description,
  );

  res.status(201).json({
    success: true,
    message: `تم إنشاء ${payments.length} سجل دفع بنجاح`,
    data: payments,
  });
});
