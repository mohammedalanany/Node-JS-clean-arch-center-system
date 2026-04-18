import { Router, Request, Response } from 'express';
import { adService } from './ad.service';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { UserRole } from '../auth/user.entity';
import { asyncHandler } from '../../shared/middlewares/error.middleware';

const router = Router();

// Render superadmin ads management page
router.get('/superadmin/ads', authenticate, authorize(UserRole.SUPERADMIN), asyncHandler(async (req: Request, res: Response) => {
  const ads = await adService.getAll();
  res.render('pages/superadmin-ads', {
    title: 'إدارة الإعلانات - نظام السنتر',
    user: req.user,
    ads
  });
}));

// API: Create Ad
router.post('/api/v1/ads', authenticate, authorize(UserRole.SUPERADMIN), asyncHandler(async (req: Request, res: Response) => {
  const ad = await adService.create(req.body);
  res.status(201).json({ success: true, data: ad });
}));

// API: Toggle active status
router.patch('/api/v1/ads/:id/toggle', authenticate, authorize(UserRole.SUPERADMIN), asyncHandler(async (req: Request, res: Response) => {
  const ad = await adService.toggleActive(Number(req.params.id));
  res.json({ success: true, data: ad });
}));

// API: Delete Ad
router.delete('/api/v1/ads/:id', authenticate, authorize(UserRole.SUPERADMIN), asyncHandler(async (req: Request, res: Response) => {
  await adService.delete(Number(req.params.id));
  res.json({ success: true, message: 'تم الحذف' });
}));

export default router;
