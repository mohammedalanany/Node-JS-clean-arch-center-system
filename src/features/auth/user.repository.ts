import { AppDataSource } from '../../config/data-source';
import { User, UserRole } from './user.entity';

export const UserRepository = AppDataSource.getRepository(User).extend({
  findAllByCenter(centerId: number) {
    return this.find({ where: { centerId }, order: { createdAt: 'DESC' } });
  },

  findByIdAndCenter(id: number, centerId: number) {
    return this.findOne({ where: { id, centerId } });
  },

  findByEmail(email: string, centerId?: number) {
    return this.findOne({ where: { email, ...(centerId ? { centerId } : {}) } });
  },

  findTeachersByCenter(centerId: number) {
    return this.find({ where: { centerId, role: UserRole.TEACHER, isActive: true } });
  },

  findSuperAdmin() {
    return this.findOne({ where: { role: UserRole.SUPERADMIN } });
  },
});
