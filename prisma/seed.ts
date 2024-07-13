import { PrismaClient } from '@prisma/client';

import Tables from './seeds/tables';

const prisma = new PrismaClient();

const executeSeeds = async () => {
  Tables(prisma)
    .then(async () => {
      console.info('End seeding!!!');

      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e: any) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
};

executeSeeds();
