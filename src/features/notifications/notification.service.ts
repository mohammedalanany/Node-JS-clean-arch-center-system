import { NotificationRepository } from './notification.repository';
import { Notification, NotificationType } from './notification.entity';
import { createError } from '../../shared/middlewares/error.middleware';

export interface CreateNotificationDto {
  title: string;
  content: string;
  type?: NotificationType;
  groupId?: number;
}

export class NotificationService {
  async getAll(centerId: number) {
    return NotificationRepository.findAllByCenter(centerId);
  }

  async create(dto: CreateNotificationDto, centerId: number) {
    const notification = NotificationRepository.create({
      ...dto,
      centerId,
    });
    return NotificationRepository.save(notification);
  }

  async toggleActive(id: number, centerId: number) {
    const notif = await NotificationRepository.findOneBy({ id, centerId });
    if (!notif) throw createError('الإشعار غير موجود', 404);
    notif.isActive = !notif.isActive;
    return NotificationRepository.save(notif);
  }

  async delete(id: number, centerId: number) {
    const notif = await NotificationRepository.findOneBy({ id, centerId });
    if (!notif) throw createError('الإشعار غير موجود', 404);
    await NotificationRepository.remove(notif);
  }
}

export const notificationService = new NotificationService();
