// backend/api/src/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './prisma';
import { redisClient } from './redis'; // 1. Importe o nosso cliente Redis
import { Jogador, Modificador } from '@prisma/client'; // Importe o tipo Modificador

const server = Fastify({ logger: true });

server.register(cors, { origin: '*' });

// --- ROTA COM CACHE ---
server.get('/modificadores', async (request, reply) => {
  const CACHE_KEY = 'modificadores'; // A chave que usaremos para armazenar no Redis

  try {
    // 2. Tenta buscar do cache primeiro
    const cachedModificadores = await redisClient.get(CACHE_KEY);

    if (cachedModificadores) {
      server.log.info('CACHE HIT! Servindo dados do Redis.');
      // Os dados no Redis são strings, então precisamos fazer o parse de volta para JSON
      return reply.send(JSON.parse(cachedModificadores));
    }

    // 3. Se não estiver no cache (CACHE MISS), busca do banco de dados
    server.log.info('CACHE MISS! Buscando dados do PostgreSQL.');
    const modificadoresDoDB = await prisma.modificador.findMany();

    // 4. Salva os dados no Redis para a próxima requisição
    // JSON.stringify para converter o objeto/array em uma string
    // 'EX', 300 define um tempo de expiração de 300 segundos (5 minutos)
    await redisClient.set(CACHE_KEY, JSON.stringify(modificadoresDoDB), {
      EX: 300, 
    });

    // 5. Retorna os dados buscados do banco de dados
    return reply.send(modificadoresDoDB);

  } catch (error) {
    server.log.error(error);
    reply.status(500).send({ error: 'Erro interno do servidor' });
  }
});

// Rota para buscar o jogador
server.get('/jogador', async (request, reply) => {
  // Como só temos um jogador, buscamos pelo ID 1
  const jogador = await prisma.jogador.findUnique({
    where: { id: 1 },
  });
  return jogador;
});

// Rota para atualizar o jogador
server.put('/jogador', async (request, reply) => {
  // Validação básica do corpo da requisição (pode ser melhorada com Zod)
  const jogadorData = request.body as Jogador;

  const jogadorAtualizado = await prisma.jogador.update({
    where: { id: 1 },
    data: {
      modificadores_equipados: jogadorData.modificadores_equipados,
      ante_atual: jogadorData.ante_atual,
      meta_pontos: jogadorData.meta_pontos,
      maos_restantes: jogadorData.maos_restantes,
      dinheiro: jogadorData.dinheiro,
    },
  });

  return jogadorAtualizado;
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port: port, host: '0.0.0.0' });
    server.log.info(`Servidor rodando na porta ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();