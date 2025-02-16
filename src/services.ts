import { PrismaClient } from "@prisma/client";
import { Aluno, AlunoInfo, Nota } from "./models";

const prisma = new PrismaClient();

export async function listaAlunos() {
  try {
    const alunos = await prisma.aluno.findMany({ include: { notas: true } });
    return alunos;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function criaAluno(aluno: Aluno) {
  try {
    const existente = await prisma.aluno.findUnique({
      where: { cpf: aluno.cpf },
    });
    if (existente !== null) {
      return false;
    }
    const novoAluno = await prisma.aluno.create({ data: aluno });
    return novoAluno;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function criaNota(alunoCpf: string, nota: Nota) {
  try {
    const aluno = await prisma.aluno.findUnique({ where: { cpf: alunoCpf }, include: { notas: { where: { semestre: Math.floor(nota.semestre) } } } });
    if (aluno === null) {
      return false;
    }
    if (aluno.notas.length > 0) {
      return true;
    }
    const novaNota = await prisma.nota.create({
      data: {
        alunoCpf: alunoCpf,
        semestre: Math.floor(nota.semestre),
        nota: nota.nota,
      },
    });
    return novaNota;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deletaAluno(cpf: string) {
  try {
    const aluno = await prisma.aluno.findUnique({ where: { cpf: cpf } });
    if (aluno === null) {
      return false;
    }
    await prisma.aluno.delete({ where: { cpf: cpf } });
    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function atualizaAluno(cpf: string, aluno: AlunoInfo) {
  try {
    const existente = await prisma.aluno.findUnique({
      where: { cpf: cpf },
    });
    if (existente === null) {
      return false
    }
    const alunoAtualizado = await prisma.aluno.update({
      where: { cpf: cpf },
      data: { nome: aluno.nome, serie: aluno.serie },
    });
    return alunoAtualizado;
  } catch (err) {
    console.error(err);
    return null;
  }
}