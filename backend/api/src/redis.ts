// backend/api/src/redis.ts
import { createClient } from 'redis';

// Pega a URL do Redis das variáveis de ambiente que definimos no docker-compose.yml
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Cria o cliente Redis
export const redisClient = createClient({
  url: redisUrl,
});

// Listener de eventos para sabermos o que está acontecendo
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Conectado ao Redis com sucesso!'));

// Inicia a conexão com o servidor Redis
// É uma função async, então usamos uma IIFE (Immediately Invoked Function Expression)
// para poder usar await no nível superior do módulo.
(async () => {
  await redisClient.connect();
})();