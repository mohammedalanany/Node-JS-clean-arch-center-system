import { Router } from 'express';
import * as AttendanceController from './attendance.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

// View Routes
router.get('/', authenticate as any, AttendanceController.renderAttendanceHub as any);

// API Routes
router.get('/api/:groupId/:date', authenticate as any, AttendanceController.apiGetGroupAttendance as any);
router.post('/api/bulk', authenticate as any, AttendanceController.apiBulkSaveAttendance as any);
router.post('/api/scan', authenticate as any, AttendanceController.apiRecordScan as any);
router.get('/api/reports', authenticate as any, AttendanceController.apiGetReports as any);

export default router;
