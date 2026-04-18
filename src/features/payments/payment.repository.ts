import { AppDataSource } from '../../config/data-source';
import { Payment, PaymentStatus } from './payment.entity';
import { Between } from 'typeorm';

export const PaymentRepository = AppDataSource.getRepository(Payment).extend({
  /** All payments for a center with student & group relations */
  findAllByCenter(centerId: number) {
    return this.find({
      where: { centerId },
      relations: ['student', 'group'],
      order: { createdAt: 'DESC' },
    });
  },

  findByIdAndCenter(id: number, centerId: number) {
    return this.findOne({
      where: { id, centerId },
      relations: ['student', 'group'],
    });
  },

  findByStudent(studentId: number, centerId: number) {
    return this.find({
      where: { studentId, centerId },
      relations: ['group'],
      order: { createdAt: 'DESC' },
    });
  },

  findByGroup(groupId: number, centerId: number) {
    return this.find({
      where: { groupId, centerId },
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  },

  /** Summary stats for dashboard */
  async getSummary(centerId: number) {
    const result = await this.createQueryBuilder('payment')
      .select('payment.status', 'status')
      .addSelect('SUM(payment.amount)', 'total')
      .addSelect('SUM(payment.paidAmount)', 'totalPaid')
      .addSelect('COUNT(payment.id)', 'count')
      .where('payment.centerId = :centerId', { centerId })
      .groupBy('payment.status')
      .getRawMany();

    const summary = {
      totalCollected: 0,
      totalPending: 0,
      totalPartial: 0,
      totalRefunded: 0,
      countCollected: 0,
      countPending: 0,
      countAll: 0,
    };

    for (const row of result) {
      const amount = Number(row.total) || 0;
      const count = Number(row.count) || 0;
      summary.countAll += count;
      if (row.status === PaymentStatus.PAID) {
        summary.totalCollected = amount;
        summary.countCollected = count;
      } else if (row.status === PaymentStatus.PENDING) {
        summary.totalPending = amount;
        summary.countPending = count;
      } else if (row.status === PaymentStatus.PARTIAL) {
        summary.totalPartial += Number(row.totalPaid) || 0;
        // remaining from partial payments
        summary.totalPending += amount - (Number(row.totalPaid) || 0);
      } else if (row.status === PaymentStatus.REFUNDED) {
        summary.totalRefunded = amount;
      }
    }

    return summary;
  },

  /** Monthly revenue for the current month */
  async getMonthlyRevenue(centerId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await this.createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalRevenue')
      .addSelect('COUNT(payment.id)', 'count')
      .where('payment.centerId = :centerId', { centerId })
      .andWhere('payment.status = :status', { status: PaymentStatus.PAID })
      .andWhere('payment.paidAt BETWEEN :start AND :end', {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
      })
      .getRawOne();

    return {
      revenue: Number(result?.totalRevenue) || 0,
      count: Number(result?.count) || 0,
    };
  },

  /** Monthly breakdown (last 6 months) for charts */
  async getMonthlyBreakdown(centerId: number) {
    const months: { month: string; collected: number; pending: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthLabel = start.toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' });

      const result = await this.createQueryBuilder('payment')
        .select('payment.status', 'status')
        .addSelect('SUM(payment.amount)', 'total')
        .where('payment.centerId = :centerId', { centerId })
        .andWhere('payment.dueDate BETWEEN :start AND :end', {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        })
        .groupBy('payment.status')
        .getRawMany();

      let collected = 0;
      let pending = 0;
      for (const row of result) {
        if (row.status === PaymentStatus.PAID) collected += Number(row.total) || 0;
        else if (row.status === PaymentStatus.PENDING || row.status === PaymentStatus.PARTIAL) pending += Number(row.total) || 0;
      }

      months.push({ month: monthLabel, collected, pending });
    }

    return months;
  },

  /** Overdue payments (past dueDate and still pending/partial) */
  async getOverdue(centerId: number) {
    const today = new Date().toISOString().split('T')[0];
    return this.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.student', 'student')
      .leftJoinAndSelect('payment.group', 'group')
      .where('payment.centerId = :centerId', { centerId })
      .andWhere('payment.status IN (:...statuses)', { statuses: [PaymentStatus.PENDING, PaymentStatus.PARTIAL] })
      .andWhere('payment.dueDate < :today', { today })
      .orderBy('payment.dueDate', 'ASC')
      .getMany();
  },

  countByCenter(centerId: number) {
    return this.count({ where: { centerId } });
  },
});
