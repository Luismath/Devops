/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Nota` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Nota" DROP CONSTRAINT "Nota_alunoCpf_fkey";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "deletedAt",
ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Nota" DROP COLUMN "deletedAt",
ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_alunoCpf_fkey" FOREIGN KEY ("alunoCpf") REFERENCES "Aluno"("cpf") ON DELETE CASCADE ON UPDATE CASCADE;
