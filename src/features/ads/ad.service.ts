import { AppDataSource } from '../../config/data-source';
import { Advertisement } from '../../shared/entities/ad.entity';

export const adService = {
  async getAllActive() {
    const repo = AppDataSource.getRepository(Advertisement);
    return repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  },

  async getAll() {
    const repo = AppDataSource.getRepository(Advertisement);
    return repo.find({ order: { createdAt: 'DESC' } });
  },

  async create(data: Partial<Advertisement>) {
    const repo = AppDataSource.getRepository(Advertisement);
    const ad = repo.create(data);
    return repo.save(ad);
  },

  async delete(id: number) {
    const repo = AppDataSource.getRepository(Advertisement);
    return repo.delete(id);
  },

  async toggleActive(id: number) {
    const repo = AppDataSource.getRepository(Advertisement);
    const ad = await repo.findOne({ where: { id } });
    if (!ad) throw new Error('Ad not found');
    ad.isActive = !ad.isActive;
    return repo.save(ad);
  }
};
