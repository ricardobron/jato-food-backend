import { Request, Response } from 'express';
import AppError from '@app/errors/AppError';

import prisma from '@app/lib/prisma';
import { hash } from 'bcryptjs';

class UserController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const hashedPassword = await hash(password, 8);

    const findedUser = await prisma.user.findUnique({ where: { email } });

    if (findedUser) {
      throw new AppError('User already registered');
    }

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: 'ADMIN' },
    });

    return res.json({
      id: user.id,
      email: user.email,
    });
  }
}

export default new UserController();
