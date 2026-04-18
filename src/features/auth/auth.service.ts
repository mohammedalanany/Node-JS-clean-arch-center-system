import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from './user.repository';
import { LoginDto, CreateUserDto } from './auth.dto';
import { UserRole } from './user.entity';
import { createError } from '../../shared/middlewares/error.middleware';
import { StudentRepository } from '../students/student.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  /** Login — works for both API and view controllers */
  async login(dto: LoginDto, centerId?: number) {
    const user = await UserRepository.findByEmail(dto.email, centerId);

    if (!user || !user.isActive) {
      throw createError('Invalid email or password', 401);
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw createError('Invalid email or password', 401);
    }

    const payload = {
      id: user.id,
      role: user.role,
      centerId: user.centerId ?? null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        centerId: user.centerId,
      },
    };
  }

  /** Register a new user scoped to a center (admin action) */
  async register(dto: CreateUserDto, centerId: number, role: UserRole = UserRole.TEACHER) {
    const existing = await UserRepository.findByEmail(dto.email, centerId);
    if (existing) throw createError('Email already exists for this center', 409);

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = UserRepository.create({ ...dto, password: hashed, role, centerId });
    return UserRepository.save(user);
  }

  /** Create the very first superadmin (setup screen — runs once) */
  async createSuperAdmin(dto: CreateUserDto) {
    const existing = await UserRepository.findSuperAdmin();
    if (existing) throw createError('Superadmin already exists', 409);

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = UserRepository.create({
      ...dto,
      password: hashed,
      role: UserRole.SUPERADMIN,
      centerId: undefined,
    });
    return UserRepository.save(user);
  }

  async loginStudent(identifier: string, password: string) {
    // Try by barcode first, then phone
    let student = await StudentRepository.findOne({
      where: [{ barcode: identifier }, { phone: identifier }],
      relations: ['center']
    });

    if (!student || !student.isActive) {
      throw createError('كود الطالب أو رقم المرور غير صحيح', 401);
    }

    const passwordMatch = await bcrypt.compare(password, student.password || '');
    if (!passwordMatch) {
      throw createError('كود الطالب أو رقم المرور غير صحيح', 401);
    }

    const payload = {
      id: student.id,
      role: UserRole.STUDENT,
      centerId: student.centerId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    return {
      token,
      user: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        role: UserRole.STUDENT,
        centerId: student.centerId,
      },
    };
  }
}

export const authService = new AuthService();
