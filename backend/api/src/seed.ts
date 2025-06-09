// backend/api/src/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding...');

  // Limpa dados antigos para evitar duplicatas
  await prisma.jogador.deleteMany();
  await prisma.modificador.deleteMany();

  // Cria os modificadores
  await prisma.modificador.createMany({
    data: [
      { id: 1, nome: "Coringa Ganancioso", descricao: "Ganha +20 de Pontos para cada carta de Ouros.", imagem_url: "url_da_imagem", efeito: { tipo: "BONUS_POR_NAIPE", naipe: "ouros", valor: 20 }},
      { id: 2, nome: "Coringa de Aço", descricao: "Multiplica a pontuação final por 1.5x.", imagem_url: "url_da_imagem", efeito: { tipo: "MULTIPLICADOR_FINAL", valor: 1.5 }},
      { id: 3, nome: "Coringa do Quarteto", descricao: "Adiciona +100 Pontos se a mão for uma Quadra.", imagem_url: "url_da_imagem", efeito: { tipo: "BONUS_POR_JOGADA", jogada: "quadra", valor: 100 }},
      { id: 4, nome: "Coringa Preguiçoso", descricao: "Adiciona +50 Pontos fixos.", imagem_url: "url_da_imagem", efeito: { tipo: "BONUS_PONTOS_FIXO", valor: 50 }},
    ],
    skipDuplicates: true,
  });

  // Cria o jogador inicial
  await prisma.jogador.create({
    data: {
      id: 1,
      dinheiro: 100,
      modificadores_equipados: [1],
      ante_atual: 1,
      meta_pontos: 300,
      maos_por_ante: 4,
      maos_restantes: 4,
    },
  });

  console.log('Seeding finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });