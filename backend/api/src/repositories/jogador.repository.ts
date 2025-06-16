import { prisma } from '../prisma';
import { Jogador } from '@prisma/client';
export const findJogadorById = async (id: number) => {
  return prisma.jogador.findUnique({ where: { id } });
};
export const updateJogadorData = async (id: number, data: Partial<Jogador>) => {
  return prisma.jogador.update({ where: { id }, data });
};