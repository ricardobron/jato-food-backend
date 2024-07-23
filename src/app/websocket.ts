import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import { ITokenPayload } from './middlewares/ensureAuthenticated';
import prisma from './lib/prisma';
import { Order } from '@prisma/client';
import { Server } from 'socket.io';

let io: Server;

export const setupWebsocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: true },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token as string;

    if (!token) return next(new Error('User not authenticated'));

    try {
      const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload;

      const subDecoded = JSON.parse(decoded.sub) as {
        user_id: string;
      };

      socket.data.user_id = subDecoded.user_id;

      return next();
    } catch {
      return next(new Error('Token expired'));
    }
  });

  io.on('connection', async (socket) => {
    const user_id = socket.data.user_id as string;

    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!user) return;

    if (user.role === 'ADMIN') {
      socket.join('admin');
    } else {
      await prisma.connections.create({
        data: { socket_id: socket.id, user_id },
      });
    }

    socket.on('order_item_update', async (data: ISockeUpdateOrderItem) => {
      await updateOrderItemSocket(data);
    });

    socket.on('disconnect', async () => {
      if (user.role === 'ADMIN') {
        io.in(socket.id).socketsLeave('admin');
      } else {
        const connectionActive = await prisma.connections.findFirst({
          where: { socket_id: socket.id },
        });

        await prisma.connections.delete({
          where: { id: connectionActive?.id },
        });
      }
    });
  });
};

export type ICreatedOrderSocket = Order & {
  order_items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};

interface ISocketCreateOrder {
  user_id: string;
  order: ICreatedOrderSocket;
}

interface ISockeUpdateOrderItem {
  order_id: string;
  order_item_id: string;
  checked: boolean;
}

export const createOrderSocket = async ({
  order,
  user_id,
}: ISocketCreateOrder) => {
  const userConnections = await prisma.connections.findMany({
    where: {
      user_id,
    },
  });

  const userSocketIds = userConnections.map((pr) => pr.socket_id);

  io.to(['admin', ...userSocketIds]).emit('order_created', order);
};

export const updateOrderSocket = async ({
  order,
  user_id,
}: ISocketCreateOrder) => {
  const userConnections = await prisma.connections.findMany({
    where: {
      user_id,
    },
  });

  const userSocketIds = userConnections.map((pr) => pr.socket_id);

  io.to(['admin', ...userSocketIds]).emit('order_updated', order);
};

export const updateOrderItemSocket = async ({
  order_id,
  order_item_id,
  checked,
}: ISockeUpdateOrderItem) => {
  const order = await prisma.orderItem.update({
    data: { checked },
    where: { order_id, id: order_item_id },
  });

  io.to(['admin']).emit('order_item_updated', order);
};
