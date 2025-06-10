// backend/api/src/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './prisma';
import { redisClient } from './redis';
import { Jogador } from '@prisma/client';

const server = Fastify({ logger: true });

server.register(cors, { origin: '*' });

// --- ROTA COM CACHE CORRIGIDA ---
server.get('/modificadores', async (request, reply) => {
  const CACHE_KEY = 'modificadores';

  try {
    // Checa se o cliente Redis está conectado e pronto
    if (redisClient.isReady) {
      const cachedModificadores = await redisClient.get(CACHE_KEY);
      if (cachedModificadores) {
        server.log.info({ api_instance: process.env.HOSTNAME }, 'CACHE HIT!');
        return reply.send(JSON.parse(cachedModificadores));
      }
    }

    // Se o cache falhar ou não encontrar, busca do DB
    server.log.info({ api_instance: process.env.HOSTNAME }, 'CACHE MISS! Buscando do PostgreSQL.');
    const modificadoresDoDB = await prisma.modificador.findMany();

    // Salva no cache se o cliente estiver pronto
    if (redisClient.isReady) {
      // Usamos set com um objeto de opções
      await redisClient.set(CACHE_KEY, JSON.stringify(modificadoresDoDB), {
        EX: 300, // Expira em 5 minutos
      });
    }

    return reply.send(modificadoresDoDB);

  } catch (error) {
    server.log.error(error, "### ERRO NA ROTA /modificadores ###");
    return reply.status(500).send({ error: 'Erro ao buscar modificadores' });
  }
});


// --- OUTRAS ROTAS ---
server.get('/jogador', async (request, reply) => {
  try {
    const jogador = await prisma.jogador.findUnique({ where: { id: 1 } });
    if (!jogador) {
      return reply.status(404).send({ error: 'Jogador não encontrado' });
    }
    return reply.send(jogador);
  } catch (error) {
    server.log.error(error, "### ERRO NA ROTA /jogador ###");
    return reply.status(500).send({ error: 'Erro ao buscar jogador' });
  }
});

server.put('/jogador', async (request, reply) => {
  try {
    const jogadorData = request.body as Partial<Jogador>; // Usamos Partial para mais flexibilidade
    const jogadorAtualizado = await prisma.jogador.update({
      where: { id: 1 },
      data: jogadorData
    });
    return reply.send(jogadorAtualizado);
  } catch (error) {
    server.log.error(error, "### ERRO NA ROTA PUT /jogador ###");
    return reply.status(500).send({ error: 'Erro ao atualizar jogador' });
  }
});


// --- INÍCIO DO SERVIDOR CORRIGIDO ---
const start = async () => {
  try {
    // --- PONTO DA CORREÇÃO ---
    await redisClient.connect();

    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port: port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();