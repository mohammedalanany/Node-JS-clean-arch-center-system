import { AppDataSource } from '../../config/data-source';
import { Center } from '../../shared/entities/center.entity';

export const CenterRepository = AppDataSource.getRepository(Center).extend({
  findBySlug(slug: string) {
    return this.findOne({ where: { slug } });
  },

  findActiveCenters() {
    return this.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  },

  findByIdWithUsers(id: number) {
    return this.findOne({ where: { id }, relations: ['users'] });
  },
});
