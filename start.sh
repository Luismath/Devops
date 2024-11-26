#!/bin/sh

echo "Aplicando Migrações do Prisma"
yarn prisma migrate deploy

echo "Iniciando API"
yarn start:prod
