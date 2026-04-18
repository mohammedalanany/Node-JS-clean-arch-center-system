import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn, Index,
} from 'typeorm';
import { Center } from '../../shared/entities/center.entity';
import { Group } from '../groups/group.entity';
import { ExamResult } from './exam-result.entity';

@Entity('exams')
@Index(['centerId'])
export class Exam {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalMarks!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column()
  centerId!: number;

  @Column({ nullable: true })
  groupId?: number;

  @ManyToOne(() => Center, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'centerId' })
  center!: Center;

  @ManyToOne(() => Group, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group?: Group;

  @OneToMany(() => ExamResult, (result) => result.exam)
  results!: ExamResult[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
