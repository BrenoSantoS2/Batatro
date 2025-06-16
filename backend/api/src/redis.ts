// backend/api/src/redis.ts
import { createClient, RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Criamos o cliente, mas não o conectamos ainda.
const client: RedisClientType = createClient({
  url: redisUrl,
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis está se conectando...'));
client.on('ready', () => console.log('Redis conectado e pronto para uso!'));

// Esta é a função que o resto do nosso app vai usar.
export const getRedisClient = async (): Promise<RedisClientType> => {
  // Se o cliente ainda não estiver conectado, conecte.
  if (!client.isOpen) {
    await client.connect();
  }
  // Retorna o cliente (seja o recém-conectado ou o já existente).
  return client;
};