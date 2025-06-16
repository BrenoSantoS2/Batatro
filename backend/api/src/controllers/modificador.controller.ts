import { FastifyRequest, FastifyReply } from 'fastify';
import * as modificadorService from '../services/modificador.service';
export const getAllModificadores = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const modificadores = await modificadorService.getModificadoresComCache();
    return reply.send(modificadores);
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' });
  }
};