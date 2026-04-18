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
import { Notification } from '../features/notifications/notification.entity';
import { Advertisement } from '../shared/entities/ad.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'center_system',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Center, User, Student, Group, Attendance, Payment, Exam, ExamResult, Notification, Advertisement],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
