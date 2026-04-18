import { GroupRepository } from './group.repository';
import { GroupType, Group, GroupStage, GroupTrack } from './group.entity';
import { createError } from '../../shared/middlewares/error.middleware';
import { AppDataSource } from '../../config/data-source';
import { Student } from '../students/student.entity';

export interface CreateGroupDto {
  name: string;
  description?: string;
  type: GroupType;
  stage?: GroupStage;
  grade?: number;
  track?: GroupTrack;
  weeklySchedule?: { day: string; startTime: string; endTime: string }[];
  teacherId?: number;
}

export interface UpdateGroupDto extends Partial<CreateGroupDto> {}

export class GroupService {
  private studentRepo = AppDataSource.getRepository(Student);

  async getAll(centerId: number) {
    return GroupRepository.findAllByCenter(centerId);
  }

  async getById(id: number, centerId: number) {
    const group = await GroupRepository.findByIdAndCenter(id, centerId);
    if (!group) throw createError('المجموعة غير موجودة', 404);
    return group;
  }

  async create(dto: CreateGroupDto, centerId: number) {
    const group = GroupRepository.create({ ...dto, centerId });
    return GroupRepository.save(group);
  }

  async update(id: number, centerId: number, dto: UpdateGroupDto) {
    const group = await this.getById(id, centerId);
    Object.assign(group, dto);
    return GroupRepository.save(group);
  }

  async delete(id: number, centerId: number) {
    const group = await GroupRepository.findOne({ where: { id, centerId } });
    if (!group) throw createError('المجموعة غير موجودة', 404);
    await GroupRepository.remove(group);
  }

  async enrollStudent(groupId: number, centerId: number, studentId: number) {
    const group = await GroupRepository.findOne({
      where: { id: groupId, centerId },
      relations: ['students'],
    });
    if (!group) throw createError('المجموعة غير موجودة', 404);

    const student = await this.studentRepo.findOne({ where: { id: studentId, centerId } });
    if (!student) throw createError('الطالب غير موجود', 404);

    // Validate academic compatibility
    if (group.stage && (group.stage as string) !== (student.stage as string)) {
      throw createError('مرحلة الطالب الدراسية لا تتوافق مع المجموعة', 400);
    }
    if (group.grade && group.grade !== student.grade) {
      throw createError('صف الطالب الدراسي لا يتوافق مع المجموعة', 400);
    }
    if (group.track && group.track !== 'general' && (group.track as string) !== (student.track as string)) {
      throw createError('شعبة الطالب لا تتوافق مع شعبة المجموعة', 400);
    }

    if (group.students.some(s => s.id === studentId)) return group; // already enrolled

    group.students.push(student);
    return GroupRepository.save(group);
  }

  async removeStudent(groupId: number, centerId: number, studentId: number) {
    const group = await GroupRepository.findOne({
      where: { id: groupId, centerId }
    });
    if (!group) throw createError('المجموعة غير موجودة', 404);

    await GroupRepository.createQueryBuilder()
      .relation(Group, 'students')
      .of(groupId)
      .remove(studentId);
    
    return group;
  }

  // Get students filtered by group's academic profile
  async getAllStudents(centerId: number, group?: Group) {
    const where: any = { centerId, isActive: true };
    if (group?.stage) where.stage = group.stage;
    if (group?.grade) where.grade = group.grade;
    if (group?.track && group.track !== 'general') where.track = group.track;
    return this.studentRepo.find({ where, order: { firstName: 'ASC' } });
  }
}

export const groupService = new GroupService();
