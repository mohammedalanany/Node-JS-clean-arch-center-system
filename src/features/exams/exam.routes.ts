import { Router } from 'express';
import {
  renderCenterExams, renderExamDetail,
  apiGetExams, apiCreateExam, apiUpdateExam, apiDeleteExam, apiRecordResults,
} from './exam.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';

const router = Router();

// ── View Routes ────────────────────────────────────────────────────────────────
router.get('/center/exams', authenticate, renderCenterExams);
router.get('/center/exams/:id', authenticate, renderExamDetail);

// ── API Routes ─────────────────────────────────────────────────────────────────
router.get('/api/v1/exams', authenticate, apiGetExams);
router.post('/api/v1/exams', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), apiCreateExam);
router.put('/api/v1/exams/:id', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER), apiUpdateExam);
router.delete('/api/v1/exams/:id', authenticate, authorize(UserRole.ADMIN), apiDeleteExam);

router.post('/api/v1/exams/:id/results', authenticate, authorize(UserRole.ADMIN, UserRole.TEACHER, UserRole.RECEPTIONIST), apiRecordResults);

export default router;
