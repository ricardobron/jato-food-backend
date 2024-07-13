/*
  Warnings:

  - The values [New,ToDeliver,Rejected,Unpaid] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `table` on the `orders` table. All the data in the column will be lost.
  - Added the required column `table_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('Preparing', 'Paid', 'Delivered');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Preparing';
COMMIT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "table",
ADD COLUMN     "table_id" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Preparing';

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "pin" TEXT NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
