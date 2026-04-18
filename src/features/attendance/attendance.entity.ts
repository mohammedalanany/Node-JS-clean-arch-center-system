import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Group } from '../groups/group.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT  = 'absent',
  LATE    = 'late',
  EXCUSED = 'excused',
}

@Entity('attendances')
@Index(['centerId'])
@Index(['groupId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  status!: AttendanceStatus;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column()
  centerId!: number;

  @Column()
  studentId!: number;

  @Column()
  groupId!: number;

  @ManyToOne(() => Student, (student) => student.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student!: Student;

  @ManyToOne(() => Group, (group) => group.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @CreateDateColumn()
  createdAt!: Date;
}
