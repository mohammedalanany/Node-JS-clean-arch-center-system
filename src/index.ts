import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { AppDataSource } from './config/data-source';
import { errorHandler } from './shared/middlewares/error.middleware';

// ── Feature Routes ─────────────────────────────────────────────────────────────
import authRoutes from './features/auth/auth.routes';
import studentRoutes from './features/students/student.routes';
import centerRoutes from './features/centers/center.routes';
import groupRoutes from './features/groups/group.routes';
import attendanceRoutes from './features/attendance/attendance.routes';
import paymentRoutes from './features/payments/payment.routes';
import examRoutes from './features/exams/exam.routes';
import notificationRoutes from './features/notifications/notification.routes';
import adRoutes from './features/ads/ad.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// ── View Engine ────────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, '../public')));

// ── Mount Feature Routes ───────────────────────────────────────────────────────
app.use(authRoutes);
app.use(studentRoutes);
app.use('/center/attendance', attendanceRoutes);
app.use(centerRoutes);
app.use(groupRoutes);
app.use(paymentRoutes);
app.use(examRoutes);
app.use(notificationRoutes);
app.use(adRoutes);

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use(errorHandler);

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Database + Server Bootstrap ────────────────────────────────────────────────
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

export default app;
