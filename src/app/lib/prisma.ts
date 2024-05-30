/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/naming-convention */
import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
declare namespace NodeJS {
  interface Global {
    prisma: PrismaClient;
  }
}
declare const global: NodeJS.Global;

// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'localhost') global.prisma = prisma;

export default prisma;
