import { describe, it, expect, vi } from 'vitest';
import * as handlers from '../src/handlers';
import * as services from '../src/services';

const dataComum = new Date(2025, 1, 15, 0, 0, 0, 0)
const alunoUm = { nome: 'Aluno 1', cpf: '12345678901', serie: 1, createdAt: dataComum, updatedAt: dataComum, notas: [] };

describe('handlers', () => {
  describe('Listar Alunos', () => {
    it('Deve retornar a lista de alunos"', async () => {
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'listaAlunos').mockResolvedValue([alunoUm]);
      await handlers.listaAlunos(req as any, res as any)
      expect(res.json).toHaveBeenCalledExactlyOnceWith([alunoUm]);
      expect(res.status).toHaveBeenCalledExactlyOnceWith(200);
    });
    it('Deve retornar um erro 500 se a lista de alunos falhar"', async () => {
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'listaAlunos').mockResolvedValue(null);
      await handlers.listaAlunos(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(500);
    });
  });

  describe('Criar Aluno', () => {
    it('Deve criar um aluno e retornar 201', async () => {
      const req = { body: { nome: "Aluno 1", cpf: "12345678901", serie: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaAluno').mockResolvedValue(alunoUm);
      await handlers.criaAluno(req as any, res as any)
      expect(res.json).toHaveBeenCalledExactlyOnceWith(alunoUm);
      expect(res.status).toHaveBeenCalledExactlyOnceWith(201);
    });

    it('Deve retornar um erro 500 se a criação do aluno falhar"', async () => {
      const req = { body: { nome: "Aluno 1", cpf: "12345678901", serie: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaAluno').mockResolvedValue(null);
      await handlers.criaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(500);
    });

    it('Deve retornar um erro 409 se o aluno já existir"', async () => {
      const req = { body: { nome: "Aluno 1", cpf: "12345678901", serie: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaAluno').mockResolvedValue(false);
      await handlers.criaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(409);
    });

    it('Deve retornar um erro 422 se o cpf for inválido"', async () => {
      const req = { body: { nome: "Aluno 1", cpf: "1234567890", serie: 1 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      await handlers.criaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(422);
    });
  });

  describe('Criar Nota', () => {
    it('Deve criar uma nota e retornar 201', async () => {
      const req = { params: { cpf: '12345678901' }, body: { semestre: 1, nota: 10 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaNota').mockResolvedValue({ alunoCpf: '12345678901', semestre: 1, nota: 10, createdAt: dataComum, updatedAt: dataComum });
      await handlers.criaNota(req as any, res as any)
      expect(res.json).toHaveBeenCalledExactlyOnceWith({ alunoCpf: '12345678901', semestre: 1, nota: 10, createdAt: dataComum, updatedAt: dataComum });
      expect(res.status).toHaveBeenCalledExactlyOnceWith(201);
    });

    it('Deve retornar um erro 500 se a criação da nota falhar"', async () => {
      const req = { params: { cpf: '12345678901' }, body: { semestre: 1, nota: 10 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaNota').mockResolvedValue(null);
      await handlers.criaNota(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(500);
    });

    it('Deve retornar um erro 404 se o aluno não existir"', async () => {
      const req = { params: { cpf: '1234567890' }, body: { semestre: 1, nota: 10 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaNota').mockResolvedValue(false);
      await handlers.criaNota(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(404);
    });

    it('Deve retornar um erro 409 se a nota já existir"', async () => {
      const req = { params: { cpf: '12345678901' }, body: { semestre: 1, nota: 10 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'criaNota').mockResolvedValue(true);
      await handlers.criaNota(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(409);
    });
  });

  describe('Deletar Aluno', () => {
    it('Deve deletar um aluno e retornar 204', async () => {
      const req = { params: { cpf: '12345678901' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'deletaAluno').mockResolvedValue(true);
      await handlers.deletaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(204);
    });

    it('Deve retornar um erro 500 se a deleção do aluno falhar"', async () => {
      const req = { params: { cpf: '12345678901' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'deletaAluno').mockResolvedValue(null);
      await handlers.deletaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(500);
    });

    it('Deve retornar um erro 404 se o aluno não existir"', async () => {
      const req = { params: { cpf: '1234567890' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'deletaAluno').mockResolvedValue(false);
      await handlers.deletaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(404);
    });
  });

  describe('Atualizar Aluno', () => {
    it('Deve atualizar um aluno e retornar 200', async () => {
      const req = { params: { cpf: '12345678901' }, body: { nome: "Aluno 1", serie: 2 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      const alunoAtualizado = { nome: 'Aluno 1', cpf: '12345678901', serie: 2, createdAt: dataComum, updatedAt: dataComum, notas: [] };
      vi.spyOn(services, 'atualizaAluno').mockResolvedValue(alunoAtualizado);
      await handlers.atualizaAluno(req as any, res as any)
      expect(res.json).toHaveBeenCalledExactlyOnceWith(alunoAtualizado);
      expect(res.status).toHaveBeenCalledExactlyOnceWith(200);
    });

    it('Deve retornar um erro 500 se a atualização do aluno falhar"', async () => {
      const req = { params: { cpf: '12345678901' }, body: { nome: "Aluno 1", serie: 2 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'atualizaAluno').mockResolvedValue(null);
      await handlers.atualizaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(500);
    });

    it('Deve retornar um erro 404 se o aluno não existir"', async () => {
      const req = { params: { cpf: '1234567890' }, body: { nome: "Aluno 1", serie: 2 } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn()
      };
      vi.spyOn(services, 'atualizaAluno').mockResolvedValue(false);
      await handlers.atualizaAluno(req as any, res as any)
      expect(res.sendStatus).toHaveBeenCalledExactlyOnceWith(404);
    });
  });
});