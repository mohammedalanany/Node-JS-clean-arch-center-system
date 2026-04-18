import { Router } from 'express';
import {
  renderCenterNotifications,
  apiCreateNotification, apiToggleNotification, apiDeleteNotification,
} from './notification.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';

const router = Router();

// ── View Routes ────────────────────────────────────────────────────────────────
router.get('/center/notifications', authenticate, renderCenterNotifications);

// ── API Routes ─────────────────────────────────────────────────────────────────
router.post('/api/v1/notifications', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), apiCreateNotification);
router.patch('/api/v1/notifications/:id/toggle', authenticate, authorize(UserRole.ADMIN), apiToggleNotification);
router.delete('/api/v1/notifications/:id', authenticate, authorize(UserRole.ADMIN), apiDeleteNotification);

export default router;
