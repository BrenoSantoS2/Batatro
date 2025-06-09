# backend/api/Dockerfile

# --- Estágio 1: Builder ---
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copia package.json e schema.prisma primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instala TODAS as dependências
RUN npm install

# --- PONTO DA CORREÇÃO ---
# Gera o cliente Prisma com base no schema
RUN npx prisma generate

# Copia o resto do código fonte
COPY . .

# Compila o TypeScript
RUN npm run build


# --- Estágio 2: Production ---
FROM node:18-alpine
WORKDIR /usr/src/app

# Copia package.json e schema.prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instala apenas as dependências de produção
RUN npm install --only=production

# Copia o código compilado do estágio 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# --- PONTO DA CORREÇÃO 2 ---
# Copia o cliente Prisma já gerado do estágio 'builder'
COPY --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

EXPOSE 3000
CMD [ "node", "dist/server.js" ]