import { AppDataSource } from '../../config/data-source';
import { Group } from './group.entity';

export const GroupRepository = AppDataSource.getRepository(Group).extend({
  findAllByCenter(centerId: number) {
    return this.find({
      where: { centerId },
      relations: ['teacher', 'students'],
      order: { createdAt: 'DESC' },
    });
  },

  findByIdAndCenter(id: number, centerId: number) {
    return this.findOne({
      where: { id, centerId },
      relations: ['teacher', 'students', 'students.attendances'],
    });
  },

  countByCenter(centerId: number) {
    return this.count({ where: { centerId } });
  },
});
