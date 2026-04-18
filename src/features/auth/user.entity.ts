import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Center } from '../../shared/entities/center.entity';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  RECEPTIONIST = 'receptionist',
  STUDENT = 'student',
}

@Entity('users')
@Index(['email', 'centerId'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;



  @Column({ length: 100 })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.TEACHER })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  centerId?: number;

  @ManyToOne(() => Center, (center) => center.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'centerId' })
  center?: Center;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
