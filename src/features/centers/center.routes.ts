import { Router } from 'express';
import {
  renderDashboard, renderCentersList, renderAddCenter, processAddCenter,
  renderSettings, apiUpdateSettings
} from './center.controller';
import { renderCenterSchedule } from './center-management.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';

const router = Router();

router.get('/dashboard', authenticate, renderDashboard);

// ── Center Management Pages (Admin / Teacher) ──────────────────────────────────
router.get('/center/schedule', authenticate, renderCenterSchedule);
router.get('/center/settings', authenticate, authorize(UserRole.ADMIN), renderSettings);

// ── API Routes ───────────────────────────────────────────────────────────────
router.put('/api/v1/centers/settings', authenticate, authorize(UserRole.ADMIN), apiUpdateSettings);

// ── Superadmin: Center CRUD ────────────────────────────────────────────────────
router.get('/centers', authenticate, authorize(UserRole.SUPERADMIN), renderCentersList);
router.get('/centers/new', authenticate, authorize(UserRole.SUPERADMIN), renderAddCenter);
router.post('/centers/new', authenticate, authorize(UserRole.SUPERADMIN), processAddCenter);

export default router;
