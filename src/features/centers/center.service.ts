import { CenterRepository } from './center.repository';
import { createError } from '../../shared/middlewares/error.middleware';

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
    return CenterRepository.save(center);
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
