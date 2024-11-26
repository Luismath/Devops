import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

type Aluno = {
  nome: string;
  cpf: string;
  serie: number;
};

type AlunoInfo = {
  nome: string;
  serie: number;
};

type Nota = {
  semestre: number;
  nota: number;
};

const prisma = new PrismaClient();

async function listaAlunos(req: Request, res: Response) {
  try {
    const alunos = await prisma.aluno.findMany({ include: { notas: true } });
    res.status(200).json(alunos);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function criaAluno(req: Request, res: Response) {
  try {
    const alunoCorpo = req.body as Aluno;
    if (alunoCorpo.cpf.length != 11) {
      res.sendStatus(422);
      return;
    }
    const novoAluno = await prisma.aluno.create({ data: alunoCorpo });
    res.status(201).json(novoAluno);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function criaNota(req: Request, res: Response) {
  try {
    const alunoCpf = req.params.cpf;
    if (!alunoCpf || alunoCpf.length != 11) {
      res.sendStatus(404);
      return;
    }
    const notaCorpo = req.body as Nota;
    const novaNota = await prisma.nota.create({
      data: {
        alunoCpf: alunoCpf,
        semestre: notaCorpo.semestre,
        nota: notaCorpo.nota,
      },
    });
    res.status(201).json(novaNota);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function deletaAluno(req: Request, res: Response) {
  try {
    const alunoCpf = req.params.cpf;
    if (!alunoCpf || alunoCpf.length != 11) {
      res.sendStatus(404);
      return;
    }
    const aluno = await prisma.aluno.findUnique({ where: { cpf: alunoCpf } });
    if (aluno === null) {
      res.sendStatus(404);
      return;
    }
    await prisma.aluno.update({
      where: { cpf: alunoCpf },
      data: { deletedAt: new Date() },
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function atualizaAluno(req: Request, res: Response) {
  try {
    const alunoCorpo = req.body as AlunoInfo;
    const alunoCpf = req.params.cpf;
    if (!alunoCpf || alunoCpf.length != 11) {
      res.sendStatus(404);
      return;
    }
    const aluno = prisma.aluno.findUnique({ where: { cpf: alunoCpf } });
    if (aluno === null) {
      res.sendStatus(404);
      return;
    }

    const alunoAtualizado = await prisma.aluno.update({
      where: { cpf: alunoCpf },
      data: alunoCorpo,
    });
    res.status(200).json(alunoAtualizado);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

function main() {
  let port = Number(process.env.SERVER_PORT);
  if (isNaN(port)) {
    port = 8080;
  }
  const app = express();
  app.use(express.json());

  const route = Router();

  route.get("/alunos", listaAlunos);
  route.post("/alunos", criaAluno);
  route.delete("/alunos/:cpf", deletaAluno);
  route.put("/alunos/:cpf", atualizaAluno);
  route.post("/alunos/:cpf/notas", criaNota);

  app.use(route);

  app.listen(port, () => console.log(`Aguardando na porta ${port}`));
}

main();
