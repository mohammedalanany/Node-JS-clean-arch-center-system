import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Center } from '../../shared/entities/center.entity';
import { Group } from '../groups/group.entity';

export enum NotificationType {
  INFO    = 'info',
  WARNING = 'warning',
  AD      = 'ad',
  SUCCESS = 'success',
}

@Entity('notifications')
@Index(['centerId'])
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.INFO })
  type!: NotificationType;

  @Column({ default: true })
  isActive!: boolean;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
