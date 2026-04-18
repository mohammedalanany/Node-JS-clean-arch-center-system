import { StudentRepository } from './student.repository';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { createError } from '../../shared/middlewares/error.middleware';
import bcrypt from 'bcrypt';

export class StudentService {
  async getAll(centerId: number) {
    return StudentRepository.findAllByCenter(centerId);
  }

  async getById(id: number, centerId: number) {
    const student = await StudentRepository.findByIdAndCenter(id, centerId);
    if (!student) throw createError('Student not found', 404);
    return student;
  }

  async search(centerId: number, query: string) {
    return StudentRepository.searchByName(centerId, query);
  }

  async create(dto: CreateStudentDto, centerId: number) {
    const password = dto.password || dto.parentPhone || '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = StudentRepository.create({ ...dto, centerId, password: hashedPassword });
    return StudentRepository.save(student);
  }

  async update(id: number, centerId: number, dto: UpdateStudentDto) {
    const student = await this.getById(id, centerId);
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(student, dto);
    return StudentRepository.save(student);
  }

  async delete(id: number, centerId: number) {
    const student = await this.getById(id, centerId);
    student.status = 'archived' as any;
    await StudentRepository.save(student);
    await StudentRepository.softRemove(student);
  }

  async updateStatus(id: number, centerId: number, status: string) {
    const student = await this.getById(id, centerId);
    student.status = status as any;
    return StudentRepository.save(student);
  }

  async enrollInGroup(id: number, centerId: number, groupId: number) {
    const student = await StudentRepository.findOne({
      where: { id, centerId },
      relations: ['groups']
    });
    if (!student) throw createError('Student not found', 404);
    
    // Check if already enrolled (ManyToMany handles this but we want to be explicit)
    if (student.groups.some(g => g.id === groupId)) return student;

    // We need the group entity to add it
    const group = await StudentRepository.manager.getRepository('groups').findOne({ where: { id: groupId, centerId } });
    if (!group) throw createError('Group not found', 404);

    student.groups.push(group as any);
    return StudentRepository.save(student);
  }

  async removeFromGroup(id: number, centerId: number, groupId: number) {
    const student = await StudentRepository.findOne({
      where: { id, centerId },
      relations: ['groups']
    });
    if (!student) throw createError('Student not found', 404);
    
    student.groups = student.groups.filter(g => g.id !== groupId);
    return StudentRepository.save(student);
  }

  async getProfileInfo(id: number, centerId: number) {
    const student = await StudentRepository.findProfileData(id, centerId);
    if (!student) throw createError('Student not found', 404);

    // 1. Attendance Analytics
    const totalSessions = student.attendances.length;
    const presentSessions = student.attendances.filter(a => a.status === 'present').length;
    const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;

    // 2. Academic Analytics
    const totalWeight = student.examResults.length;
    const averageScore = totalWeight > 0 
      ? student.examResults.reduce((acc, curr) => acc + Number(curr.attainedMarks), 0) / totalWeight 
      : 0;

    // 3. Financial Analytics
    const totalDebt = student.payments
      .filter(p => ['pending', 'partial'].includes(p.status))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    return {
      student,
      stats: {
        attendanceRate: attendanceRate.toFixed(1),
        averageScore: averageScore.toFixed(1),
        totalDebt: totalDebt.toFixed(2),
        presentCount: presentSessions,
        totalSessions,
      }
    };
  }
}

export const studentService = new StudentService();
