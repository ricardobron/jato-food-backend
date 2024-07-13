import prisma from '@app/lib/prisma';
import { Request, Response } from 'express';

class TableController {
  async showPin(req: Request, res: Response) {
    const { table_number } = req.query;

    const table = await prisma.tables.findFirstOrThrow({
      where: { number: Number(table_number) },
      select: {
        pin: true,
      },
    });

    return res.json({ pin_table: table.pin });
  }
}

export default new TableController();
