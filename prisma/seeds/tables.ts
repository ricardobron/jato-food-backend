import { Prisma, PrismaClient, Tables } from '@prisma/client';

function generatePin(length: number) {
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10);
  }
  return pin;
}

function generateTables() {
  const objects: Prisma.TablesCreateInput[] = [];

  for (let i = 1; i <= 30; i++) {
    const pin = generatePin(6);
    const obj = {
      pin: pin,
      number: i,
    };

    objects.push(obj);
  }

  return objects;
}

export default async (prisma: PrismaClient): Promise<void> => {
  const createdTables: Prisma.TablesCreateInput[] = generateTables();

  console.log('Tables');

  const tables = await prisma.tables.count();
  if (tables > 0) return;

  await prisma.tables.createMany({ data: createdTables });
};
