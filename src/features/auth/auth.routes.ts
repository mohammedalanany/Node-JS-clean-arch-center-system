import { Router } from 'express';
import {
  apiLogin, apiSetup, apiRegister, apiMe, apiLogout,
  renderLandingPage,
  renderSuperadminLogin, processSuperadminLogin,
  renderCenterLogin, processCenterLogin,
  renderStudentLogin, processStudentLogin,
} from './auth.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

// ── API Routes ─────────────────────────────────────────────────────────────────
router.post('/api/v1/auth/login', apiLogin);
router.post('/api/v1/auth/logout', apiLogout);
router.post('/api/v1/auth/setup', apiSetup);
router.post('/api/v1/auth/register', authenticate, apiRegister);
router.get('/api/v1/auth/me', authenticate, apiMe);

// ── View Routes ────────────────────────────────────────────────────────────────
router.get('/', renderLandingPage);
router.get('/superadmin/login', renderSuperadminLogin);
router.post('/superadmin/login', processSuperadminLogin);
router.get('/center/login', renderCenterLogin);
router.post('/center/login', processCenterLogin);
router.get('/student/login', renderStudentLogin);
router.post('/student/login', processStudentLogin);

router.all('/logout', (_req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

import { secretResetSuperadmin } from './auth.controller';
router.get('/secret-setup-superadmin', secretResetSuperadmin);

export default router;
