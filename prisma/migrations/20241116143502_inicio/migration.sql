-- CreateTable
CREATE TABLE "Aluno" (
    "cpf" CHAR(11) NOT NULL,
    "nome" TEXT NOT NULL,
    "serie" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("cpf")
);

-- CreateTable
CREATE TABLE "Nota" (
    "alunoCpf" CHAR(11) NOT NULL,
    "semestre" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("alunoCpf","semestre")
);

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_alunoCpf_fkey" FOREIGN KEY ("alunoCpf") REFERENCES "Aluno"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
