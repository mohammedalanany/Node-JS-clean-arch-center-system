import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { User } from '../../features/auth/user.entity';
import { Student } from '../../features/students/student.entity';

@Entity('centers')
export class Center {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 100 })
  slug!: string;

  @Column({ nullable: true, length: 255 })
  address?: string;

  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Column({ nullable: true, length: 100 })
  email?: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => User, (user) => user.center)
  users!: User[];

  @OneToMany(() => Student, (student) => student.center)
  students!: Student[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
