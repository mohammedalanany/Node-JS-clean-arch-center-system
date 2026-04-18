import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Group } from '../groups/group.entity';

export enum PaymentStatus {
  PAID     = 'paid',
  PENDING  = 'pending',
  PARTIAL  = 'partial',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH      = 'cash',
  BANK      = 'bank',
  WALLET    = 'wallet',
  OTHER     = 'other',
}

@Entity('payments')
@Index(['centerId'])
@Index(['studentId'])
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount!: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'date' })
  dueDate!: Date;

  @Column({ nullable: true, type: 'date' })
  paidAt?: Date;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ nullable: true, length: 100 })
  description?: string;

  @Column()
  centerId!: number;

  @Column()
  studentId!: number;

  @Column({ nullable: true })
  groupId?: number;

  @ManyToOne(() => Student, (student) => student.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student!: Student;

  @ManyToOne(() => Group, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  group?: Group;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
