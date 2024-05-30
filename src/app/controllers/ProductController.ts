import prisma from '@app/lib/prisma';
import { ICreateProduct } from '@app/validators/products';
import { Request, Response } from 'express';

type IUpdateProduct = Partial<ICreateProduct>;

class ProductController {
  async find(req: Request, res: Response) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
    });

    const response = await prisma.products.findMany({
      where: {
        ...(user.role === 'ADMIN'
          ? { deleted_at: null }
          : { active: true, deleted_at: null }),
      },
    });

    return res.json(response);
  }

  async create(req: Request, res: Response) {
    const { name, price, active } = req.body as ICreateProduct;

    const product = await prisma.products.create({
      data: { name, price, active },
    });

    return res.json(product);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, price, active } = req.body as IUpdateProduct;

    await prisma.products.update({
      data: { name, price, active },
      where: { id },
    });

    return res.send();
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.products.update({
      data: { deleted_at: new Date() },
      where: { id },
    });

    return res.send();
  }
}

export default new ProductController();
