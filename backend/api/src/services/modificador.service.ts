import { getRedisClient } from '../redis'; // Importa a função gerenciadora

import * as modificadorRepository from '../repositories/modificador.repository';
const CACHE_KEY = 'modificadores';

export const getModificadoresComCache = async () => {
  // Pega a instância do cliente conectado
  const redisClient = await getRedisClient();

  // O resto da lógica continua a mesma...
  const cachedData = await redisClient.get(CACHE_KEY);
  if (cachedData) {
    console.log('CACHE HIT!');
    return JSON.parse(cachedData);
  }
  
  console.log('CACHE MISS!');
  const dataDoDB = await modificadorRepository.findAllModificadores();
  
  await redisClient.set(CACHE_KEY, JSON.stringify(dataDoDB), { EX: 300 });
  return dataDoDB;
};