#!/bin/sh

echo "Waiting 5s for database start"
sleep 5s

echo "Aplicando Migrações do Prisma"
yarn prisma migrate deploy

echo "Iniciando API"
yarn start:prod
