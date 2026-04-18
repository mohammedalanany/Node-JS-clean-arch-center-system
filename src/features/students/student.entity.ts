import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, OneToMany, ManyToMany, JoinColumn, Index,
} from 'typeorm';
import { Center } from '../../shared/entities/center.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Payment } from '../payments/payment.entity';
import { ExamResult } from '../exams/exam-result.entity';
import { Group } from '../groups/group.entity';

export enum StudentStage {
  PRIMARY = 'primary', // ابتدائي
  PREPARATORY = 'preparatory', // اعدادي
  SECONDARY = 'secondary', // ثانوي
}

export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  GRADUATED = 'graduated',
  ARCHIVED = 'archived',
}

export enum StudentTrack {
  SCIENTIFIC = 'scientific',
  LITERARY = 'literary',
  GENERAL = 'general',
}

@Entity('students')
@Index(['centerId'])
@Index(['barcode'], { unique: true })
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ unique: true, nullable: true, length: 50 })
  barcode?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Column({ nullable: true, length: 20 })
  parentPhone?: string;

  @Column({ nullable: true, length: 100 })
  email?: string;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth?: Date;

  @Column({ nullable: true, length: 255 })
  address?: string;

  @Column({ nullable: true, length: 100 })
  school?: string;

  @Column({ type: 'enum', enum: StudentStage, default: StudentStage.SECONDARY })
  stage!: StudentStage;

  @Column({ type: 'int', nullable: true })
  grade?: number; // 1, 2, 3...

  @Column({ type: 'enum', enum: StudentTrack, default: StudentTrack.GENERAL })
  track!: StudentTrack;

  @Column({ nullable: true, length: 255 })
  photoUrl?: string;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status!: StudentStatus;

  @Column({ default: true })
  isActive!: boolean;

  @Column()
  centerId!: number;

  @ManyToOne(() => Center, (center) => center.students, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'centerId' })
  center!: Center;

  @OneToMany(() => Attendance, (att) => att.student)
  attendances!: Attendance[];

  @OneToMany(() => Payment, (pay) => pay.student)
  payments!: Payment[];

  @OneToMany(() => ExamResult, (result) => result.student)
  examResults!: ExamResult[];

  @ManyToMany(() => Group, (group) => group.students)
  groups!: Group[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
