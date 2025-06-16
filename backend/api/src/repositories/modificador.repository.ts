import { prisma } from '../prisma';
export const findAllModificadores = async () => {
  return prisma.modificador.findMany();
};