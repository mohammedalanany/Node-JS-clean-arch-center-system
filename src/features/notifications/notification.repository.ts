import { AppDataSource } from '../../config/data-source';
import { Notification } from './notification.entity';

export const NotificationRepository = AppDataSource.getRepository(Notification).extend({
  findAllByCenter(centerId: number) {
    return this.find({
      where: { centerId },
      relations: ['group'],
      order: { createdAt: 'DESC' },
    });
  },

  findActiveByCenter(centerId: number) {
    return this.find({
      where: { centerId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  },
});
