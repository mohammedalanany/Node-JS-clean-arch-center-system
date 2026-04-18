import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn, Index,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Student } from '../students/student.entity';

export enum GroupType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

// نفس قيم StudentStage — معرّفة محلياً لتجنب الـ circular import
export enum GroupStage {
  PRIMARY = 'primary',
  PREPARATORY = 'preparatory',
  SECONDARY = 'secondary',
}

export enum GroupTrack {
  SCIENTIFIC = 'scientific',
  LITERARY = 'literary',
  GENERAL = 'general',
}

@Entity('groups')
@Index(['centerId'])
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'enum', enum: GroupType, default: GroupType.PUBLIC })
  type!: GroupType;

  // التصفية الأكاديمية
  @Column({ type: 'enum', enum: GroupStage, nullable: true })
  stage?: GroupStage;

  @Column({ type: 'int', nullable: true })
  grade?: number;

  @Column({ type: 'enum', enum: GroupTrack, nullable: true })
  track?: GroupTrack;

  // مواعيد الأسبوع المفتوحة مخزنة كـ JSON
  @Column({ type: 'json', nullable: true })
  weeklySchedule?: { day: string; startTime: string; endTime: string }[];

  @Column({ default: true })
  isActive!: boolean;

  @Column()
  centerId!: number;

  @Column({ nullable: true })
  teacherId?: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacherId' })
  teacher?: User;

  @OneToMany(() => Attendance, (att) => att.group)
  attendances!: Attendance[];

  @ManyToMany(() => Student, (student) => student.groups)
  @JoinTable({
    name: 'group_students',
    joinColumn: { name: 'groupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students!: Student[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
