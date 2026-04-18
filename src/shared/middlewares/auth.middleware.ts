import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../features/auth/user.entity';

export interface JwtPayload {
  id: number;
  role: UserRole;
  centerId: number | null;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

/** Reads token from Authorization header (API) or cookie (Views) */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: no token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    
    if (req.method === 'GET' && !req.path.startsWith('/api') && payload.centerId) {
      const { AppDataSource } = require('../../config/data-source');
      const { Center } = require('../../shared/entities/center.entity');
      const { Advertisement } = require('../../shared/entities/ad.entity');
      
      Promise.all([
        AppDataSource.getRepository(Center).findOne({ where: { id: payload.centerId } }),
        AppDataSource.getRepository(Advertisement).find({ where: { isActive: true }, order: { createdAt: 'DESC' } })
      ])
      .then(([center, ads]: [any, any[]]) => {
          if (center) res.locals.centerName = center.name;
          res.locals.systemAds = ads || [];
          next();
        })
        .catch(() => next());
      return;
    }
    
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
};

/** Middleware factory — restricts access to given roles */
export const authorize = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
