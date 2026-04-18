import { AppDataSource } from '../../config/data-source';
import { Exam } from './exam.entity';

export const ExamRepository = AppDataSource.getRepository(Exam).extend({
  findAllByCenter(centerId: number) {
    return this.find({
      where: { centerId },
      relations: ['group'],
      order: { date: 'DESC' },
    });
  },

  findByIdAndCenter(id: number, centerId: number) {
    return this.findOne({
      where: { id, centerId },
      relations: ['group', 'results', 'results.student'],
    });
  },

  findByGroup(groupId: number, centerId: number) {
    return this.find({
      where: { groupId, centerId },
      order: { date: 'DESC' },
    });
  },
});
