/*
  Warnings:

  - Added the required column `number` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "number" INTEGER NOT NULL;
