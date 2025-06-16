import { FastifyInstance } from 'fastify';
import { getAllModificadores } from '../controllers/modificador.controller';
import { getJogadorController, updateJogadorController } from '../controllers/jogador.controller';

export const registerRoutes = (server: FastifyInstance) => {
  server.get('/modificadores', getAllModificadores);
  server.get('/jogador', getJogadorController);
  server.put('/jogador', updateJogadorController);
};