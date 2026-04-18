import { Router } from 'express';
import {
  apiGetGroups, apiGetGroup, apiCreateGroup, apiUpdateGroup, apiDeleteGroup,
  apiEnrollStudent, apiRemoveStudent,
  renderGroups, renderGroupDetail,
} from './group.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';

const router = Router();

// ── API Routes ─────────────────────────────────────────────────────────────────
router.get('/api/v1/groups', authenticate, apiGetGroups);
router.post('/api/v1/groups', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiCreateGroup);
router.get('/api/v1/groups/:id', authenticate, apiGetGroup);
router.put('/api/v1/groups/:id', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiUpdateGroup);
router.delete('/api/v1/groups/:id', authenticate, authorize(UserRole.ADMIN), apiDeleteGroup);

router.post('/api/v1/groups/:id/students', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiEnrollStudent);
router.delete('/api/v1/groups/:id/students', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiRemoveStudent);

// ── View Routes ────────────────────────────────────────────────────────────────
router.get('/center/groups', authenticate, renderGroups);
router.get('/center/groups/:id', authenticate, renderGroupDetail);

export default router;
