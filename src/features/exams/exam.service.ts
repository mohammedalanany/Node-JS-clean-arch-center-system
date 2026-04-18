import { ExamRepository } from './exam.repository';
import { Exam } from './exam.entity';
import { ExamResult } from './exam-result.entity';
import { AppDataSource } from '../../config/data-source';
import { createError } from '../../shared/middlewares/error.middleware';

export interface CreateExamDto {
  title: string;
  totalMarks: number;
  date: string;
  notes?: string;
  groupId?: number;
}

export interface RecordResultDto {
  studentId: number;
  attainedMarks: number;
  notes?: string;
}

export class ExamService {
  private resultRepo = AppDataSource.getRepository(ExamResult);

  async getAll(centerId: number) {
    return ExamRepository.findAllByCenter(centerId);
  }

  async getById(id: number, centerId: number) {
    const exam = await ExamRepository.findByIdAndCenter(id, centerId);
    if (!exam) throw createError('الامتحان غير موجود', 404);
    return exam;
  }

  async create(dto: CreateExamDto, centerId: number) {
    const exam = ExamRepository.create({
      ...dto,
      centerId,
      date: new Date(dto.date),
    });
    return ExamRepository.save(exam);
  }

  async update(id: number, centerId: number, dto: Partial<CreateExamDto>) {
    const exam = await this.getById(id, centerId);
    Object.assign(exam, dto);
    if (dto.date) exam.date = new Date(dto.date);
    return ExamRepository.save(exam);
  }

  async delete(id: number, centerId: number) {
    const exam = await this.getById(id, centerId);
    await ExamRepository.remove(exam);
  }

  async recordResults(examId: number, centerId: number, results: RecordResultDto[]) {
    const exam = await this.getById(examId, centerId);
    
    const resultEntities = results.map(r => {
      return this.resultRepo.create({
        ...r,
        examId: exam.id,
      });
    });

    // Delete old results for these students if any (for update)
    const studentIds = results.map(r => r.studentId);
    await this.resultRepo.delete({ examId: exam.id, studentId: (studentIds as any) });

    return this.resultRepo.save(resultEntities);
  }

  async getExamStats(examId: number, centerId: number) {
    const exam = await this.getById(examId, centerId);
    const results = exam.results || [];
    
    if (results.length === 0) return { count: 0, average: 0, max: 0, min: 0 };

    const marks = results.map(r => Number(r.attainedMarks));
    const sum = marks.reduce((acc, curr) => acc + curr, 0);
    
    return {
      count: marks.length,
      average: (sum / marks.length).toFixed(2),
      max: Math.max(...marks),
      min: Math.min(...marks),
      passCount: marks.filter(m => m >= (exam.totalMarks / 2)).length,
    };
  }
}

export const examService = new ExamService();
