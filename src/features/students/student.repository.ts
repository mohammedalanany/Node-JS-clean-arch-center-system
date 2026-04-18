import { AppDataSource } from '../../config/data-source';
import { Student } from './student.entity';

export const StudentRepository = AppDataSource.getRepository(Student).extend({
  /** All queries are automatically scoped to a specific center */
  findAllByCenter(centerId: number) {
    return this.find({ where: { centerId }, order: { createdAt: 'DESC' } });
  },

  findByIdAndCenter(id: number, centerId: number) {
    return this.findOne({ where: { id, centerId } });
  },

  findProfileData(id: number, centerId: number) {
    return this.findOne({
      where: { id, centerId },
      relations: [
        'attendances', 
        'payments', 
        'examResults', 'examResults.exam',
        'groups'
      ],
    });
  },

  searchByName(centerId: number, query: string) {
    return this.createQueryBuilder('student')
      .where('student.centerId = :centerId', { centerId })
      .andWhere(
        '(student.firstName LIKE :q OR student.lastName LIKE :q OR student.email LIKE :q)',
        { q: `%${query}%` },
      )
      .orderBy('student.createdAt', 'DESC')
      .getMany();
  },

  countByCenter(centerId: number) {
    return this.count({ where: { centerId, isActive: true } });
  },
});
