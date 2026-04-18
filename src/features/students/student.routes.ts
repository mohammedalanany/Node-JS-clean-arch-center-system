import { Router } from 'express';
import {
  apiGetStudents, apiGetStudent, apiCreateStudent, apiUpdateStudent, apiDeleteStudent,
  apiUpdateStatus, apiEnrollInGroup, apiRemoveFromGroup,
  renderCenterStudents, renderStudentProfile, renderStudentExplore,
} from './student.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';

const router = Router();

// ── API Routes ─────────────────────────────────────────────────────────────────
router.get('/api/v1/students', authenticate, apiGetStudents);
router.post('/api/v1/students', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiCreateStudent);
router.get('/api/v1/students/:id', authenticate, apiGetStudent);
router.put('/api/v1/students/:id', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiUpdateStudent);
router.delete('/api/v1/students/:id', authenticate, authorize(UserRole.ADMIN), apiDeleteStudent);

router.patch('/api/v1/students/:id/status', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiUpdateStatus);
router.post('/api/v1/students/:id/groups', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiEnrollInGroup);
router.delete('/api/v1/students/:id/groups', authenticate, authorize(UserRole.ADMIN, UserRole.RECEPTIONIST), apiRemoveFromGroup);

// ── View Routes ────────────────────────────────────────────────────────────────
router.get('/center/students', authenticate, renderCenterStudents);
router.get('/center/students/:id/profile', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.RECEPTIONIST), renderStudentProfile);
router.get('/student/profile', authenticate, authorize(UserRole.STUDENT), renderStudentProfile);
router.get('/student/explore', renderStudentExplore);

export default router;
