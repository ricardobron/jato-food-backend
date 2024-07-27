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
  table_number: string;
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
        table: true,
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    const formatedResponse = response.map((order) => ({
      ...order,
      table: order.table.number,
      order_items: order.order_items.map((item) => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        checked: item.checked,
      })),
    }));

    return res.json(formatedResponse);
  }

  async create(req: Request, res: Response) {
    const { products, table_number } = req.body as ICreateOrder;

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

    const table = await prisma.tables.findFirstOrThrow({
      where: { number: Number(table_number) },
    });

    const { order_id } = await prisma.$transaction<{ order_id: string }>(
      async (tx) => {
        const order = await tx.order.create({
          data: {
            total,
            user_id,
            order_number: lastOrderNumber,
            table_id: table.id,
          },
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

        return { order_id: order.id };
      }
    );

    const createdOrder = await prisma.order.findFirstOrThrow({
      where: { id: order_id },
      include: { table: true, order_items: { include: { product: true } } },
    });

    const responseFormated: ICreatedOrderSocket = {
      ...createdOrder,
      table: createdOrder.table.number,
      order_items: createdOrder.order_items.map((_productItem) => ({
        id: _productItem.id,
        name: _productItem.product.name,
        price: _productItem.product.price,
        quantity: productQuantity(_productItem.product_id),
      })),
    };

    await createOrderSocket({ user_id: req.user.id, order: responseFormated });

    return res.send();
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body as IUpdateOrder;

    const _order = await prisma.order.update({
      data: { status },
      where: { id },
      include: {
        table: true,
        order_items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            checked: true,
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
        table: _order.table.number,
        order_items: _order.order_items.map((pr) => ({
          id: pr.id,
          name: pr.product.name,
          price: pr.price,
          quantity: pr.quantity,
          checked: pr.checked,
        })),
      },
    });

    return res.send();
  }
}

export default new OrderController();
