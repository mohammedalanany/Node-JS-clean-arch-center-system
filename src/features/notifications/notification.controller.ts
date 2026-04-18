import { Request, Response } from 'express';
import { notificationService } from './notification.service';
import { asyncHandler, createError } from '../../shared/middlewares/error.middleware';
import { groupService } from '../groups/group.service';

const getCenterId = (req: Request): number => {
  if (!req.user?.centerId) throw createError('Center context missing', 400);
  return req.user.centerId;
};

// ── View Controllers ───────────────────────────────────────────────────────────

export const renderCenterNotifications = asyncHandler(async (req: Request, res: Response) => {
  const centerId = getCenterId(req);
  const [notifications, groups] = await Promise.all([
    notificationService.getAll(centerId),
    groupService.getAll(centerId),
  ]);

  res.render('pages/center-notifications', {
    title: 'الإشعارات والإعلانات - أكاديمي برو',
    user: req.user,
    notifications,
    groups,
  });
});

// ── API Controllers ────────────────────────────────────────────────────────────

export const apiCreateNotification = asyncHandler(async (req: Request, res: Response) => {
  const notif = await notificationService.create(req.body, getCenterId(req));
  res.status(201).json({ success: true, data: notif });
});

export const apiToggleNotification = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.toggleActive(Number(req.params.id), getCenterId(req));
  res.json({ success: true, message: 'تم تغيير حالة الإشعار' });
});

export const apiDeleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.delete(Number(req.params.id), getCenterId(req));
  res.json({ success: true, message: 'تم حذف الإشعار بنجاح' });
});
