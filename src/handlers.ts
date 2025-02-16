import e, { NextFunction, Request, Response } from "express";
import * as services from './services'
import { Aluno, AlunoInfo, Nota } from "./models";

export async function listaAlunos(req: Request, res: Response) {
  const alunos = await services.listaAlunos();
  if (alunos == null) {
    res.sendStatus(500);
    return;
  }
  res.status(200).json(alunos);
}

export async function criaAluno(req: Request, res: Response) {
  const alunoCorpo = req.body as Aluno;
  if (alunoCorpo.cpf.length != 11) {
    res.sendStatus(422);
    return;
  }
  const novoAluno = await services.criaAluno(alunoCorpo);
  if (novoAluno === null) {
    res.sendStatus(500);
    return;
  }
  if (novoAluno === false) {
    res.sendStatus(409);
    return;
  }
  res.status(201).json(novoAluno);
}

export async function criaNota(req: Request, res: Response) {
  const alunoCpf = req.params.cpf;
  if (!alunoCpf || alunoCpf.length != 11) {
    res.sendStatus(404);
    return;
  }
  const notaCorpo = req.body as Nota;
  if (notaCorpo.nota < 0 || notaCorpo.nota > 10 || notaCorpo.semestre < 1 || notaCorpo.semestre > 2) {
    res.sendStatus(422);
    return;
  }
  const novaNota = await services.criaNota(alunoCpf, notaCorpo);
  if (novaNota == null) {
    res.sendStatus(500);
    return;
  }
  if (novaNota === false) {
    res.sendStatus(404);
    return;
  }
  if (novaNota === true) {
    res.sendStatus(409);
    return;
  }
  res.status(201).json(novaNota);
}

export async function deletaAluno(req: Request, res: Response) {
  const alunoCpf = req.params.cpf;
  if (!alunoCpf || alunoCpf.length != 11) {
    res.sendStatus(404);
    return;
  }
  const deleted = await services.deletaAluno(alunoCpf);
  if (deleted == null) {
    res.sendStatus(500);
    return;
  }
  if (!deleted) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(204);
}

export async function atualizaAluno(req: Request, res: Response) {
  const alunoCorpo = req.body as AlunoInfo;
  const alunoCpf = req.params.cpf;
  if (!alunoCpf || alunoCpf.length != 11) {
    res.sendStatus(404);
    return;
  }
  const aluno = await services.atualizaAluno(alunoCpf, alunoCorpo);
  if (aluno === false) {
    res.sendStatus(404);
    return;
  }
  if (aluno === null) {
    res.sendStatus(500);
    return;
  }
  res.status(200).json(aluno);
}

export function erroNoCorpo(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError) {
    res.sendStatus(400);
  } else {
    next();
  }
}