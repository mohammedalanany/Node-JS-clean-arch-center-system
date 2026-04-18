import { AppDataSource } from '../../config/data-source';
import { Attendance } from './attendance.entity';

export const AttendanceRepository = AppDataSource.getRepository(Attendance).extend({
  findByGroupAndDate(groupId: number, date: string, centerId: number) {
    return this.find({
      where: { groupId, date: date as any, centerId },
      relations: ['student'],
    });
  },

  findByStudent(studentId: number, centerId: number) {
    return this.find({
      where: { studentId, centerId },
      order: { date: 'DESC' },
      take: 20,
    });
  },

  countPresenceByGroup(groupId: number, centerId: number) {
     return this.count({ where: { groupId, centerId, status: 'present' as any } });
  },

  findReport(groupId: number, startDate: string, endDate: string, centerId: number) {
     const { Between } = require('typeorm');
     return this.find({
       where: { 
         groupId, 
         centerId,
         date: Between(startDate, endDate)
       },
       relations: ['student'],
       order: { date: 'DESC' }
     });
  }
});
