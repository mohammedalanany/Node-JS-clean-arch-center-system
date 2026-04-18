import { PaymentRepository } from './payment.repository';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { createError } from '../../shared/middlewares/error.middleware';
import { AppDataSource } from '../../config/data-source';
import { Group } from '../groups/group.entity';

export interface CreatePaymentDto {
  studentId: number;
  groupId?: number;
  amount: number;
  paidAmount?: number;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  description?: string;
}

export interface UpdatePaymentDto {
  amount?: number;
  paidAmount?: number;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  description?: string;
}

export class PaymentService {
  async getAll(centerId: number) {
    return PaymentRepository.findAllByCenter(centerId);
  }

  async getById(id: number, centerId: number) {
    const payment = await PaymentRepository.findByIdAndCenter(id, centerId);
    if (!payment) throw createError('Payment not found', 404);
    return payment;
  }

  async getByStudent(studentId: number, centerId: number) {
    return PaymentRepository.findByStudent(studentId, centerId);
  }

  async getByGroup(groupId: number, centerId: number) {
    return PaymentRepository.findByGroup(groupId, centerId);
  }

  async getSummary(centerId: number) {
    return PaymentRepository.getSummary(centerId);
  }

  async getMonthlyRevenue(centerId: number) {
    return PaymentRepository.getMonthlyRevenue(centerId);
  }

  async getMonthlyBreakdown(centerId: number) {
    return PaymentRepository.getMonthlyBreakdown(centerId);
  }

  async getOverdue(centerId: number) {
    return PaymentRepository.getOverdue(centerId);
  }

  async create(dto: CreatePaymentDto, centerId: number) {
    const payment = PaymentRepository.create({
      ...dto,
      centerId,
      paidAmount: dto.paidAmount || 0,
      paymentMethod: dto.paymentMethod || PaymentMethod.CASH,
      dueDate: new Date(dto.dueDate) as any,
      paidAt: dto.paidAt ? (new Date(dto.paidAt) as any) : undefined,
    });

    // Auto-set paidAmount for paid status
    if (dto.status === PaymentStatus.PAID && !dto.paidAmount) {
      payment.paidAmount = dto.amount;
    }

    return PaymentRepository.save(payment);
  }

  async update(id: number, centerId: number, dto: UpdatePaymentDto) {
    const payment = await this.getById(id, centerId);
    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.paidAmount !== undefined) payment.paidAmount = dto.paidAmount;
    if (dto.status !== undefined) payment.status = dto.status;
    if (dto.paymentMethod !== undefined) payment.paymentMethod = dto.paymentMethod;
    if (dto.dueDate !== undefined) payment.dueDate = new Date(dto.dueDate) as any;
    if (dto.paidAt !== undefined) payment.paidAt = new Date(dto.paidAt) as any;
    if (dto.notes !== undefined) payment.notes = dto.notes;
    if (dto.description !== undefined) payment.description = dto.description;

    // Auto-set paidAt when marking as paid
    if (dto.status === PaymentStatus.PAID && !payment.paidAt) {
      payment.paidAt = new Date() as any;
      payment.paidAmount = payment.amount;
    }
    return PaymentRepository.save(payment);
  }

  async delete(id: number, centerId: number) {
    const payment = await this.getById(id, centerId);
    await PaymentRepository.remove(payment);
  }

  async markAsPaid(id: number, centerId: number, paymentMethod?: PaymentMethod) {
    const payment = await this.getById(id, centerId);
    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date() as any;
    payment.paidAmount = payment.amount;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    return PaymentRepository.save(payment);
  }

  /**
   * Bulk create payments for all students in a group.
   * Useful for monthly fee generation.
   */
  async bulkCreateForGroup(
    groupId: number,
    centerId: number,
    amount: number,
    dueDate: string,
    description?: string,
  ) {
    const groupRepo = AppDataSource.getRepository(Group);
    const group = await groupRepo.findOne({
      where: { id: groupId, centerId },
      relations: ['students'],
    });

    if (!group) throw createError('المجموعة غير موجودة', 404);
    if (!group.students || group.students.length === 0) {
      throw createError('لا يوجد طلاب في هذه المجموعة', 400);
    }

    const payments: Payment[] = [];
    for (const student of group.students) {
      // Check if payment already exists for this student/group/dueDate
      const existing = await PaymentRepository.findOne({
        where: {
          studentId: student.id,
          groupId,
          centerId,
          dueDate: new Date(dueDate) as any,
        },
      });

      if (!existing) {
        const payment = PaymentRepository.create({
          studentId: student.id,
          groupId,
          centerId,
          amount,
          paidAmount: 0,
          status: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.CASH,
          dueDate: new Date(dueDate) as any,
          description: description || `اشتراك ${group.name}`,
        });
        payments.push(payment);
      }
    }

    if (payments.length === 0) {
      throw createError('جميع الطلاب لديهم بالفعل مدفوعات مسجلة لهذا التاريخ', 400);
    }

    return PaymentRepository.save(payments);
  }
}

export const paymentService = new PaymentService();
