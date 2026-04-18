import { Request, Response } from 'express';
import { attendanceService } from './attendance.service';
import { groupService } from '../groups/group.service';
import { asyncHandler, createError } from '../../shared/middlewares/error.middleware';

const getCenterId = (req: Request): number => {
  if (!req.user?.centerId) throw createError('تنبيه: سياق المركز مفقود', 400);
  return req.user.centerId;
};

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiGetGroupAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, date } = req.params;
  const centerId = getCenterId(req);
  
  const attendanceRecords = await attendanceService.getForGroupAndDate(Number(groupId), String(date), centerId);
  const group = await groupService.getById(Number(groupId), centerId);
  
  res.json({ 
    success: true, 
    data: {
      records: attendanceRecords,
      students: group.students
    } 
  });
});

export const apiBulkSaveAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, date, records } = req.body;
  const centerId = getCenterId(req);
  
  const results = await attendanceService.saveBulk(centerId, Number(groupId), String(date), { records });
  res.json({ success: true, data: results });
});

export const apiRecordScan = asyncHandler(async (req: Request, res: Response) => {
  const { groupId, date, barcode } = req.body;
  const centerId = getCenterId(req);
  
  const result = await attendanceService.recordSingleScan(centerId, Number(groupId), String(date), barcode);
  res.json({ success: true, data: result });
});

export const apiGetReports = asyncHandler(async (req: Request, res: Response) => {
   const centerId = getCenterId(req);
   const { groupId, startDate, endDate } = req.query;
   
   if (!groupId || !startDate || !endDate) {
     throw createError('يرجى تحديد المجموعة والفترة الزمنية', 400);
   }

   const data = await attendanceService.getDetailedReport(
     centerId, 
     Number(groupId), 
     String(startDate), 
     String(endDate)
   );
   
   res.json({ success: true, data });
});

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderAttendanceHub = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const groups = await groupService.getAll(centerId);
  
  res.render('pages/center-attendance', {
    title: 'نظام إدارة الحضور',
    user: req.user,
    groups,
    active: 'attendance'
  });
});
