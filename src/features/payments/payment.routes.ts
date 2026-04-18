import { Router } from 'express';
import {
  renderCenterPayments,
  apiGetPayments,
  apiGetPayment,
  apiGetPaymentsByStudent,
  apiGetPaymentsByGroup,
  apiGetSummary,
  apiGetMonthlyRevenue,
  apiGetMonthlyBreakdown,
  apiGetOverdue,
  apiCreatePayment,
  apiUpdatePayment,
  apiMarkAsPaid,
  apiDeletePayment,
  apiBulkCreateForGroup,
} from './payment.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';

const router = Router();

// ── View Routes ────────────────────────────────────────────────────────────────
router.get('/center/payments', authenticate, renderCenterPayments);

// ── API Routes ─────────────────────────────────────────────────────────────────
router.get('/api/v1/payments', authenticate, apiGetPayments);
router.get('/api/v1/payments/summary', authenticate, apiGetSummary);
router.get('/api/v1/payments/monthly-revenue', authenticate, apiGetMonthlyRevenue);
router.get('/api/v1/payments/monthly-breakdown', authenticate, apiGetMonthlyBreakdown);
router.get('/api/v1/payments/overdue', authenticate, apiGetOverdue);
router.get('/api/v1/payments/:id', authenticate, apiGetPayment);
router.get('/api/v1/students/:studentId/payments', authenticate, apiGetPaymentsByStudent);
router.get('/api/v1/groups/:groupId/payments', authenticate, apiGetPaymentsByGroup);

router.post(
  '/api/v1/payments',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  apiCreatePayment,
);

router.post(
  '/api/v1/payments/bulk-group',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  apiBulkCreateForGroup,
);

router.put(
  '/api/v1/payments/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  apiUpdatePayment,
);

router.patch(
  '/api/v1/payments/:id/pay',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  apiMarkAsPaid,
);

router.delete(
  '/api/v1/payments/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  apiDeletePayment,
);

export default router;
