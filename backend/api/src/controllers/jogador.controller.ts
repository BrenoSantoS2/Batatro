import { FastifyRequest, FastifyReply } from 'fastify';
import * as jogadorService from '../services/jogador.service';
import { Jogador } from '@prisma/client';
export const getJogadorController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const jogador = await jogadorService.getJogador();
    return reply.send(jogador);
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' });
  }
};
export const updateJogadorController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const jogadorData = request.body as Partial<Jogador>;
    const jogadorAtualizado = await jogadorService.updateJogador(jogadorData);
    return reply.send(jogadorAtualizado);
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' });
  }
};