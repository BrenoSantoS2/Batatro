import * as jogadorRepository from '../repositories/jogador.repository';
import { Jogador } from '@prisma/client';
export const getJogador = async () => {
  return jogadorRepository.findJogadorById(1);
};
export const updateJogador = async (data: Partial<Jogador>) => {
  return jogadorRepository.updateJogadorData(1, data);
};