#!/bin/sh

echo "Esperando o banco de dados"
sleep 5s

echo "Aplicando Migrações do Prisma"
yarn prisma migrate deploy

echo "Iniciando API"
yarn start:prod
