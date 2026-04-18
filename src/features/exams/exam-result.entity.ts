import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Exam } from './exam.entity';

@Entity('exam_results')
@Index(['studentId'])
@Index(['examId'])
export class ExamResult {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  attainedMarks!: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column()
  studentId!: number;

  @Column()
  examId!: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student!: Student;

  @ManyToOne(() => Exam, (exam) => exam.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examId' })
  exam!: Exam;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
