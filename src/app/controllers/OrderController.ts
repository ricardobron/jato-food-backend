import AppError from '@app/errors/AppError';
import prisma from '@app/lib/prisma';
import {
  ICreatedOrderSocket,
  createOrderSocket,
  updateOrderSocket,
} from '@app/websocket';
import { OrderStatus } from '@prisma/client';
import { Request, Response } from 'express';

interface IProductsOrder {
  id: string;
  quantity: number;
}

interface ICreateOrder {
  products: IProductsOrder[];
  table: string;
}

interface IUpdateOrder {
  status: OrderStatus;
}

class OrderController {
  async find(req: Request, res: Response) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
    });

    const response = await prisma.order.findMany({
      where: { ...(user.role === 'ADMIN' ? {} : { user_id: user.id }) },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    const formatedResponse = response.map((order) => ({
      ...order,
      order_items: order.order_items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }));

    return res.json(formatedResponse);
  }

  async create(req: Request, res: Response) {
    const { products, table } = req.body as ICreateOrder;

    const user_id = req.user.id;

    const productIds = products.map((pr) => pr.id);

    if (productIds.length === 0)
      throw new AppError('Nenhum produto selecionado');

    const allProducts = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
        name: true,
      },
    });

    function productQuantity(product_id: string) {
      return (
        products.find((_product) => _product.id === product_id)?.quantity || 0
      );
    }

    const total = allProducts.reduce(
      (acc, obj) => acc + obj.price + productQuantity(obj.id),
      0
    );

    const lastOrder = await prisma.order.findFirst({
      orderBy: { created_at: 'desc' },
    });

    const lastOrderNumber = (lastOrder?.order_number || 0) + 1;

    const createdOrder = await prisma.$transaction<ICreatedOrderSocket>(
      async (tx) => {
        const order = await tx.order.create({
          data: { table, total, user_id, order_number: lastOrderNumber },
        });

        await tx.orderItem.createMany({
          data: allProducts.map((product) => {
            return {
              order_id: order.id,
              price: product.price,
              product_id: product.id,
              quantity: productQuantity(product.id),
            };
          }),
        });

        const dataPrismaTransaction: ICreatedOrderSocket = {
          ...order,
          order_items: allProducts.map((_productItem) => ({
            name: _productItem.name,
            price: _productItem.price,
            quantity: productQuantity(_productItem.id),
          })),
        };

        return dataPrismaTransaction;
      }
    );

    await createOrderSocket({ user_id: req.user.id, order: createdOrder });

    return res.send();
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body as IUpdateOrder;

    const _order = await prisma.order.update({
      data: { status },
      where: { id },
      include: {
        order_items: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    updateOrderSocket({
      user_id: _order.user_id,
      order: {
        ..._order,
        order_items: _order.order_items.map((pr) => ({
          name: pr.product.name,
          price: pr.price,
          quantity: pr.quantity,
        })),
      },
    });

    return res.send();
  }
}

export default new OrderController();
