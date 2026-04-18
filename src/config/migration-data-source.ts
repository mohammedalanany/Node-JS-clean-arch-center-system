import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { Center } from '../shared/entities/center.entity';
import { User } from '../features/auth/user.entity';
import { Student } from '../features/students/student.entity';
import { Group } from '../features/groups/group.entity';
import { Attendance } from '../features/attendance/attendance.entity';
import { Payment } from '../features/payments/payment.entity';
import { Exam } from '../features/exams/exam.entity';
import { ExamResult } from '../features/exams/exam-result.entity';

/**
 * Dedicated DataSource for the TypeORM CLI (migrations).
 * The CLI uses this file directly via the `typeorm` command.
 */
const MigrationDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'center_system',
  synchronize: false,
  logging: true,
  entities: [Center, User, Student, Group, Attendance, Payment, Exam, ExamResult],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
});

export default MigrationDataSource;
