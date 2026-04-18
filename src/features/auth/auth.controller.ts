import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { authService } from './auth.service';
import { LoginDto, CreateUserDto } from './auth.dto';
import { asyncHandler } from '../../shared/middlewares/error.middleware';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiLogin = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(LoginDto, req.body);
  const errors = await validate(dto);
  if (errors.length) {
    res.status(400).json({ success: false, errors: errors.map((e) => Object.values(e.constraints || {})).flat() });
    return;
  }
  const { token, user } = await authService.login(dto, req.user?.centerId ?? undefined);
  res.cookie('token', token, COOKIE_OPTS);
  res.json({ success: true, token, user });
});

export const apiSetup = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(CreateUserDto, req.body);
  const errors = await validate(dto);
  if (errors.length) {
    res.status(400).json({ success: false, errors: errors.map((e) => Object.values(e.constraints || {})).flat() });
    return;
  }
  const user = await authService.createSuperAdmin(dto);
  res.status(201).json({ success: true, message: 'Superadmin created', userId: user.id });
});

export const apiRegister = asyncHandler(async (req: Request, res: Response) => {
  const dto = plainToInstance(CreateUserDto, req.body);
  const errors = await validate(dto);
  if (errors.length) {
    res.status(400).json({ success: false, errors: errors.map((e) => Object.values(e.constraints || {})).flat() });
    return;
  }
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }
  const centerId = req.user.role === 'superadmin' ? Number(req.body.centerId) : req.user.centerId;
  if (!centerId) {
    res.status(400).json({ success: false, message: 'centerId is required' });
    return;
  }
  const user = await authService.register(dto, centerId, dto.role);
  res.status(201).json({ success: true, message: 'User created successfully', userId: user.id });
});

export const apiMe = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});

export const apiLogout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderLandingPage = (req: Request, res: Response) => {
  if (req.cookies?.token) return res.redirect('/dashboard');
  res.render('pages/landing', { title: 'EduSaaS - منصة إدارة السناتر التعليمية' });
};

export const renderSuperadminLogin = (req: Request, res: Response) => {
  if (req.cookies?.token) return res.redirect('/dashboard');
  res.render('pages/superadmin-login', { error: null });
};

export const renderCenterLogin = (req: Request, res: Response) => {
  if (req.cookies?.token) return res.redirect('/dashboard');
  res.render('pages/center-login', { error: null });
};

export const renderStudentLogin = (req: Request, res: Response) => {
  if (req.cookies?.token) return res.redirect('/dashboard');
  res.render('pages/student-login', { error: null });
};

export const processSuperadminLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('البريد الإلكتروني وكلمة المرور مطلوبة');
    const { token, user } = await authService.login({ email, password });
    if (user.role !== 'superadmin') throw new Error('غير مصرح لك بالدخول للإدارة العامة');
    res.cookie('token', token, COOKIE_OPTS);
    res.redirect('/dashboard');
  } catch (err: any) {
    res.render('pages/superadmin-login', { error: err.message || 'بيانات غير صحيحة' });
  }
});

export const processCenterLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('البريد الإلكتروني وكلمة المرور مطلوبة');
    const { token, user } = await authService.login({ email, password });
    if (user.role === 'superadmin') throw new Error('برجاء الدخول من بوابة الإدارة العامة');
    if (!user.centerId) throw new Error('حسابك غير مرتبط بسنتر نشط');
    res.cookie('token', token, COOKIE_OPTS);
    res.redirect('/dashboard');
  } catch (err: any) {
    res.render('pages/center-login', { error: err.message || 'بيانات غير صحيحة' });
  }
});

export const processStudentLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) throw new Error('يرجى إدخال الكود وكلمة المرور');
    const { token } = await authService.loginStudent(identifier, password);
    res.cookie('token', token, COOKIE_OPTS);
    res.redirect('/student/profile');
  } catch (err: any) {
    res.render('pages/student-login', { error: err.message || 'بيانات غير صحيحة' });
  }
});
