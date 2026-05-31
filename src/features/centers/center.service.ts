import { CenterRepository } from './center.repository';
import { createError } from '../../shared/middlewares/error.middleware';
import { UserRepository } from '../auth/user.repository';
import { UserRole } from '../auth/user.entity';
import bcrypt from 'bcrypt';

export class CenterService {
  async createCenter(data: { name: string; address?: string; phone?: string; email?: string }) {
    let baseSlug = data.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    if (!baseSlug) baseSlug = 'center';

    let slug = baseSlug;
    let counter = 1;
    while (await CenterRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const center = CenterRepository.create({ ...data, slug });
    const savedCenter = await CenterRepository.save(center);

    // Create default admin account for this center
    const defaultEmail = data.email || `admin@${slug}.com`;
    const hashedPassword = await bcrypt.hash('123456', 10);
    const adminUser = UserRepository.create({
      firstName: 'مدير',
      lastName: 'السنتر',
      email: defaultEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      centerId: savedCenter.id,
      isActive: true,
    });
    await UserRepository.save(adminUser);

    return savedCenter;
  }

  async getAllCenters() {
    return CenterRepository.findActiveCenters();
  }

  async getById(id: number) {
    const center = await CenterRepository.findOne({ where: { id } });
    if (!center) throw createError('السنتر غير موجود', 404);
    return center;
  }

  async updateCenter(id: number, data: Partial<{ name: string; address: string; phone: string; email: string }>) {
    const center = await this.getById(id);
    Object.assign(center, data);
    return CenterRepository.save(center);
  }
}

export const centerService = new CenterService();
