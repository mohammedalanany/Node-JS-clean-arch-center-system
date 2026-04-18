import { AttendanceRepository } from './attendance.repository';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { AppDataSource } from '../../config/data-source';
import { Student } from '../students/student.entity';
import { Payment } from '../payments/payment.entity';
import { createError } from '../../shared/middlewares/error.middleware';

export interface BulkAttendanceDto {
  records: {
    studentId: number;
    status: AttendanceStatus;
    notes?: string;
  }[];
}

export class AttendanceService {
  async getForGroupAndDate(groupId: number, date: string, centerId: number) {
    return AttendanceRepository.findByGroupAndDate(groupId, date, centerId);
  }

  async saveBulk(centerId: number, groupId: number, date: string, dto: BulkAttendanceDto) {
    const results = [];

    for (const record of dto.records) {
      // Find existing record for this student on this date in this group
      let attendance = await AttendanceRepository.findOne({
        where: {
          studentId: record.studentId,
          groupId,
          date: date as any,
          centerId
        }
      });

      if (attendance) {
        // Update
        attendance.status = record.status;
        attendance.notes = record.notes;
      } else {
        // Create new
        attendance = AttendanceRepository.create({
          studentId: record.studentId,
          groupId,
          date: date as any,
          status: record.status,
          notes: record.notes,
          centerId
        });
      }

      results.push(await AttendanceRepository.save(attendance));
    }

    return results;
  }

  async getStudentHistory(studentId: number, centerId: number) {
    return AttendanceRepository.findByStudent(studentId, centerId);
  }

  async recordSingleScan(centerId: number, groupId: number, date: string, barcode: string) {
    // 1. Find student (Try by Barcode OR ID)
    const query: any = [
      { barcode: barcode, centerId }
    ];
    
    // If barcode looks like a number, also try searching by ID
    if (!isNaN(barcode as any)) {
      query.push({ id: Number(barcode), centerId });
    }

    const student = await AppDataSource.getRepository(Student).findOne({
      where: query,
      relations: ['groups']
    });

    if (!student) throw createError('الطالب غير موجود بالنظام برقم ' + barcode, 404);

    // 2. Verify Group Membership
    if (!student.groups.some(g => g.id === groupId)) {
      const groupNames = student.groups.map(g => g.name).join('، ');
      const msg = groupNames 
        ? `عذراً، هذا الطالب غير مشترك في هذه المجموعة. هو مشترك في: (${groupNames})`
        : 'عذراً، هذا الطالب غير مشترك في أي مجموعة حالياً.';
      throw createError(msg, 400);
    }

    // 3. Mark Attendance (Upsert logic)
    let attendance = await AttendanceRepository.findOne({
      where: { studentId: student.id, groupId, date: date as any, centerId }
    });

    if (attendance) {
      if (attendance.status === AttendanceStatus.PRESENT) {
         return { student, attendance, isDuplicate: true, debt: await this.calculateDebt(student.id, centerId) };
      }
      attendance.status = AttendanceStatus.PRESENT;
    } else {
      attendance = AttendanceRepository.create({
        studentId: student.id,
        groupId,
        date: date as any,
        status: AttendanceStatus.PRESENT,
        centerId
      });
    }

    const saved = await AttendanceRepository.save(attendance);
    const debt = await this.calculateDebt(student.id, centerId);

    return { student, attendance: saved, isDuplicate: false, debt };
  }

  private async calculateDebt(studentId: number, centerId: number) {
    const payments = await AppDataSource.getRepository(Payment).find({
      where: { studentId, centerId, status: 'pending' as any }
    });
    return payments.reduce((sum, p) => sum + Number(p.amount), 0);
  }

  async getDetailedReport(centerId: number, groupId: number, startDate: string, endDate: string) {
    const records = await AttendanceRepository.findReport(groupId, startDate, endDate, centerId);
    
    // Calculate simple stats
    const total = records.length;
    const present = records.filter(r => r.status === (AttendanceStatus as any).PRESENT || r.status === 'present').length;
    const absent = records.filter(r => r.status === (AttendanceStatus as any).ABSENT || r.status === 'absent').length;
    const late = records.filter(r => r.status === (AttendanceStatus as any).LATE || r.status === 'late').length;
    
    return {
      records,
      stats: {
        total,
        present,
        absent,
        late,
        presenceRate: total > 0 ? Math.round((present / total) * 100) : 0
      }
    };
  }
}

export const attendanceService = new AttendanceService();
