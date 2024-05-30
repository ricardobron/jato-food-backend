import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@app/errors/AppError';
import { Role } from '@prisma/client';
import prisma from '@app/lib/prisma';

export interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

type IRoles = Role;

export default function is(role: IRoles[]) {
  const roleAuthorized = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization || req.query.token;
    if (typeof authHeader !== 'string') {
      throw new AppError('JWT token is missing', 401);
    }

    const BEARER_PREFIX = 'Bearer ';
    const token = authHeader.startsWith(BEARER_PREFIX)
      ? authHeader.slice(BEARER_PREFIX.length)
      : authHeader;

    try {
      const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;

      const subDecoded = JSON.parse(decoded.sub);

      const user = await prisma.user.findUnique({
        where: { id: subDecoded.user_id },
      });

      if (!user) {
        throw new AppError('User not found');
      }

      if (!role.includes(user.role)) {
        throw new AppError('User dont have permission');
      }

      req.user = {
        id: subDecoded.user_id,
      };

      return next();
    } catch (err: any) {
      if (err.message === 'jwt expired') {
        throw new AppError('Token expired', 401);
      }

      throw new AppError('JWT not exists', 401);
    }
  };

  return roleAuthorized;
}

export { is };
