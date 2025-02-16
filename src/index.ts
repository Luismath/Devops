import express, { Router } from "express";
import swaggerUi from 'swagger-ui-express';
import * as handlers from "./handlers";
import swaggerJSDoc from "swagger-jsdoc";

function main() {
  let port = Number(process.env.SERVER_PORT);
  if (isNaN(port)) {
    port = 8080;
  }
  const swaggerOptions: swaggerJSDoc.Options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "API de alunos",
        version: "1.0.0",
        description: "API para cadastro de alunos produzida para avaliação de na disciplina de DevOps ministrada pelo professor Ítalo no Instituto Federal de Alagoas, Campus Arapiraca.",
      },
    },
    apis: ['./src/index*']
  }
  const swaggerDocs = swaggerJSDoc(swaggerOptions);

  const app = express();
  app.use(express.json());
  app.use(handlers.erroNoCorpo)
  app.use(
    '/docs',
    swaggerUi.serve
  );
  const route = Router();

  route.get("/docs", swaggerUi.setup(swaggerDocs));

  /**
  * @openapi
  * /alunos:
  *   get:
  *     tags:
  *       - Alunos
  *     summary: Lista alunos
  *     produces:
  *       - application/json
  *     description: Lista alunos e suas notas.
  *     responses:
  *       200:
  *         description: Retorna a lista de alunos.
  *       500:
  *         description: Erro interno.
  */
  route.get("/alunos", handlers.listaAlunos);

  /**
  * @openapi
  * /alunos:
  *   post:
  *     tags:
  *       - Alunos
  *     summary: Cria um aluno
  *     description: Cria um aluno conforme informações no corpo.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nome:
  *                 type: string
  *                 description: O nome do aluno.
  *                 example: "Luis Carlos da Silva"
  *               cpf:
  *                 type: string
  *                 description: O CPF do aluno, sem pontuação.
  *                 example: "12345678900"
  *               serie:
  *                 type: integer
  *                 description: A série do aluno.
  *                 example: 7
  *     responses:
  *       201:
  *         description: Retorna o aluno criado.
  *       409:
  *         description: Aluno já existente.
  *       422:
  *         description: Erro de validação.
  *       500:
  *         description: Erro interno
  */
  route.post("/alunos", handlers.criaAluno);

  /**
  * @openapi
  * /alunos/{cpf}:
  *   delete:
  *     tags:
  *       - Alunos
  *     summary: Deletar aluno
  *     description: Deleta um aluno e suas notas.
  *     parameters:
  *       - in: path
  *         name: cpf
  *         required: true
  *         description: CPF do aluno, sem pontuação.
  *         schema:
  *           type: string
  *           example: "12345678900"
  *     responses:
  *       204:
  *         description: Aluno deletado com sucesso.
  *       404:
  *         description: Aluno não encontrado.
  *       500:
  *         description: Erro interno
  */
  route.delete("/alunos/:cpf", handlers.deletaAluno);

  /**
  * @openapi
  * /alunos/{cpf}:
  *   put:
  *     tags:
  *       - Alunos
  *     summary: Atualizar aluno
  *     description: Altera as informações de um aluno.
  *     parameters:
  *       - in: path
  *         name: cpf
  *         required: true
  *         description: CPF do aluno, sem pontuação.
  *         schema:
  *           type: string
  *           example: "12345678900"
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nome:
  *                 type: string
  *                 description: O nome do aluno.
  *                 example: "Luis Carlos da Silva"
  *               serie:
  *                 type: integer
  *                 description: A série do aluno.
  *                 example: 7
  *     responses:
  *       200:
  *         description: Retorna o aluno atualizado.
  *       404:
  *         description: Aluno não encontrado.
  *       422:
  *         description: Erro de validação.
  *       500:
  *         description: Erro interno
  */
  route.put("/alunos/:cpf", handlers.atualizaAluno);

  /**
  * @openapi
  * /alunos/{cpf}/notas:
  *   post:
  *     tags:
  *       - Notas
  *     summary: Adicionar nota.
  *     description: Adiciona uma nota ao aluno.
  *     parameters:
  *       - in: path
  *         name: cpf
  *         required: true
  *         description: CPF do aluno, sem pontuação.
  *         schema:
  *           type: string
  *           example: "12345678900"
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               semestre:
  *                 type: integer
  *                 description: O semestre do aluno.
  *                 example: 1
  *               nota:
  *                 type: float
  *                 description: A nota do aluno no respectivo semestre.
  *                 example: 8.4
  *     responses:
  *       201:
  *         description: Retorna a nota criada.
  *       404:
  *         description: Aluno não encontrado.
  *       409:
  *         description: Nota do semestre já cadastrada.
  *       422:
  *         description: Erro de validação.
  *       500:
  *         description: Erro interno
  */
  route.post("/alunos/:cpf/notas", handlers.criaNota);

  app.use(route);

  app.listen(port, () => console.log(`Aguardando na porta ${port}`));
}

main();
