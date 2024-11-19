FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./

RUN yarn install

COPY prisma/ ./prisma

RUN yarn prisma generate

COPY src/ ./src

RUN yarn build

FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY prisma/ ./prisma
COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --production

COPY start.sh ./
RUN chmod +x ./start.sh

COPY --from=builder /app/dist/ ./dist/

CMD [ "./start.sh" ]
EXPOSE ${SERVER_PORT}