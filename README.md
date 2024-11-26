# Devops


## O que foi feito?
Conteinerizado uma api, construída em node usando prisma e express, e um banco de dados, PostgreSQL, por meio de um compose docker.

A comunicação entre os dois containers é feita por meio da rede `api-network` que é definida pelo compose, evitando expor o banco de dados a outros aplicativos.
## A api
A API possui como finalidade simular um sistema de cadastro de alunos e notas (dos alunos), para tal ela possuí 5 endpoints.
### GET /alunos
Lista todos os alunos cadastrados.
### POST /alunos
Adiciona um aluno no sistema.
#### Corpo
- cpf: cpf do aluno.
- serie: serie do aluno.
### PUT /alunos/:cpf
Altera as informações de um aluno cadastrado.
#### Corpo
- serie: serie do aluno
### DELETE /alunos/:cpf
Remove um aluno cadastrado.
### POST /alunos/:cpf/notas
Adiciona a nota de um aluno.
#### Corpo
- semestre: semestre do qual a nota é correspondente.
- nota: valor da nota alcançada pelo aluno.

## O banco de dados
Para configurar o banco de dados foi usado o comando migrate do prisma para, de forma automática, gerar as tabelas e esquemas necessários.

Para evitar o uso do banco como administrador foi usado esse [script](https://gist.github.com/beldpro-ci/bc8d1a48f6a012a1b494460aac84796a#file-01-filladb-sh) adaptado, nele é realizada a checagem de todas as variáveis de ambiente necessárias e executado os comandos (via psql) para criar um novo usuário, banco de dados e garantir acesso apenas ao novo banco criado.

Como o PostgreSQL salva seus dados (por padrão) na pasta `/var/lib/pgsql/data` para manter os dados entre execuções foi criado o volume `api-data` que armazena os arquivos dessa página e replica em caso de nova execução.

## Para rodar
Basta executar o comando:
  ```bash
  docker compose up
  ```