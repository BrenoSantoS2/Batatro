// backend/api/src/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors, { origin: '*' });
registerRoutes(server);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();