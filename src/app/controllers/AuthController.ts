import { Request, Response } from 'express';
import AppError from '@app/errors/AppError';

import prisma from '@app/lib/prisma';
import { compare } from 'bcryptjs';

import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';
import { IAuthClient } from '@app/validators/authClient';

class AuthController {
  async admin(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError('User not found');
    }

    if (!user.password || user.role !== 'ADMIN') {
      throw new AppError('User not allowed');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Password not match');
    }

    const { expiresInToken, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: JSON.stringify({
        user_id: user.id,
      }),
      expiresIn: expiresInToken,
    });

    return res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  }

  async client(req: Request, res: Response) {
    const { phone_number, pin_table, table } = req.body as IAuthClient;

    let user;

    user = await prisma.user.findFirst({
      where: {
        phone_number,
      },
      select: {
        id: true,
        phone_number: true,
        role: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone_number,
        },
      });
    }

    const _table = await prisma.tables.findFirst({ where: { number: table } });

    if (!_table) {
      throw new AppError('Table not found');
    }

    if (_table.pin !== pin_table) {
      throw new AppError('Pin not match');
    }

    const { expiresInToken, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: JSON.stringify({
        user_id: user.id,
      }),
      expiresIn: expiresInToken,
    });

    return res.json({
      user: { id: user.id, phone_number, role: user.role },
      token,
    });
  }
}

export default new AuthController();
