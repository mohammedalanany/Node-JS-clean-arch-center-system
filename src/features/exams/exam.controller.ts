import { Request, Response } from 'express';
import { examService } from './exam.service';
import { asyncHandler, createError } from '../../shared/middlewares/error.middleware';
import { groupService } from '../groups/group.service';
import { studentService } from '../students/student.service';

const getCenterId = (req: Request): number => {
  if (!req.user?.centerId) throw createError('Center context missing', 400);
  return req.user.centerId;
};

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderCenterExams = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const [exams, groups] = await Promise.all([
    examService.getAll(centerId),
    groupService.getAll(centerId),
  ]);

  res.render('pages/center-exams', {
    title: 'إدارة الاختبارات - أكاديمي برو',
    user: req.user,
    exams,
    groups,
  });
});

export const renderExamDetail = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const exam = await examService.getById(Number(req.params.id), centerId);
  const stats = await examService.getExamStats(exam.id, centerId);

  // Fetch students who should take this exam
  let students = [];
  if (exam.groupId) {
    const group = await groupService.getById(exam.groupId, centerId);
    students = group.students || [];
  } else {
    students = await studentService.getAll(centerId);
  }

  res.render('pages/exam-detail', {
    title: `تفاصيل امتحان ${exam.title}`,
    user: req.user,
    exam,
    stats,
    students,
  });
});

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiGetExams = asyncHandler(async (req: Request, res: Response) => {
  const exams = await examService.getAll(getCenterId(req));
  res.json({ success: true, data: exams });
});

export const apiCreateExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.create(req.body, getCenterId(req));
  res.status(201).json({ success: true, data: exam });
});

export const apiUpdateExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.update(Number(req.params.id), getCenterId(req), req.body);
  res.json({ success: true, data: exam });
});

export const apiDeleteExam = asyncHandler(async (req: Request, res: Response) => {
  await examService.delete(Number(req.params.id), getCenterId(req));
  res.json({ success: true, message: 'تم حذف الامتحان بنجاح' });
});

export const apiRecordResults = asyncHandler(async (req: Request, res: Response) => {
  const { results } = req.body; // Array of { studentId, attainedMarks, notes }
  if (!Array.isArray(results)) throw createError('النتائج يجب أن تكون مصفوفة', 400);
  
  await examService.recordResults(Number(req.params.id), getCenterId(req), results);
  res.json({ success: true, message: 'تم رصد الدرجات بنجاح' });
});
