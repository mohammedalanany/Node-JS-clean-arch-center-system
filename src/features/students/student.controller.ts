import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { studentService } from './student.service';
import { groupService } from '../groups/group.service';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { asyncHandler, createError } from '../../shared/middlewares/error.middleware';

const getCenterId = (req: Request): number => {
  if (!req.user?.centerId) throw createError('Center context missing', 400);
  return req.user.centerId;
};

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiGetStudents = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const { q } = req.query;
  const students = q
    ? await studentService.search(centerId, String(q))
    : await studentService.getAll(centerId);
  res.json({ success: true, data: students });
});

export const apiGetStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.getById(Number(req.params.id), getCenterId(req));
  res.json({ success: true, data: student });
});

export const apiCreateStudent = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(CreateStudentDto, req.body);
  const errors = await validate(dto);
  if (errors.length) {
    res.status(400).json({ success: false, errors: errors.map((e) => Object.values(e.constraints || {})).flat() });
    return;
  }
  const student = await studentService.create(dto, getCenterId(req));
  res.status(201).json({ success: true, data: student });
});

export const apiUpdateStudent = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(UpdateStudentDto, req.body);
  const errors = await validate(dto, { skipMissingProperties: true });
  if (errors.length) {
    res.status(400).json({ success: false, errors: errors.map((e) => Object.values(e.constraints || {})).flat() });
    return;
  }
  const student = await studentService.update(Number(req.params.id), getCenterId(req), dto);
  res.json({ success: true, data: student });
});

export const apiDeleteStudent = asyncHandler(async (req: Request, res: Response) => {
  await studentService.delete(Number(req.params.id), getCenterId(req));
  res.json({ success: true, message: 'Student archived successfully' });
});

export const apiUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const student = await studentService.updateStatus(Number(req.params.id), getCenterId(req), status);
  res.json({ success: true, data: student });
});

export const apiEnrollInGroup = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.body;
  const student = await studentService.enrollInGroup(Number(req.params.id), getCenterId(req), Number(groupId));
  res.json({ success: true, data: student });
});

export const apiRemoveFromGroup = asyncHandler(async (req: Request, res: Response) => {
  const { groupId } = req.body;
  await studentService.removeFromGroup(Number(req.params.id), getCenterId(req), Number(groupId));
  res.json({ success: true, message: 'Student removed from group' });
});

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderStudentExplore = (_req: Request, res: Response) => {
  res.render('pages/student-explore', { title: 'استكشاف الكورسات' });
};

export const renderCenterStudents = asyncHandler(async (req: Request, res: Response) => {
  const centerId = req.user?.centerId;
  if (!centerId) return res.redirect('/');
  const students = await studentService.getAll(centerId);
  res.render('pages/center-students', {
    title: 'إدارة الطلاب',
    user: req.user,
    students,
  });
});
export const renderStudentProfile = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  let studentId = Number(req.params.id);

  // If student is logging in, use their own ID from the session
  if (req.user?.role === 'student') {
    studentId = req.user.id;
  }

  if (!studentId) throw createError('Student ID is required', 400);

  const data = await studentService.getProfileInfo(studentId, centerId);
  const groups = await groupService.getAll(centerId);

  res.render('pages/student-profile', {
    title: `ملف الطالب: ${data.student.firstName}`,
    user: req.user,
    student: data.student,
    stats: data.stats,
    allGroups: groups
  });
});
