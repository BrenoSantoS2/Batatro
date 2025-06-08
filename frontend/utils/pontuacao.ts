// frontend/utils/pontuacao.ts
import { Carta } from './baralho';

export interface ResultadoPontuacao {
  nomeJogada: string;
  pontosBase: number;
  multiplicadorBase: number;
}

// Esta função analisa uma mão e retorna a melhor jogada
export const analisarMao = (mao: Carta[]): ResultadoPontuacao => {
  const contagemValores: { [key: string]: number } = {};
  for (const carta of mao) {
    contagemValores[carta.valor] = (contagemValores[carta.valor] || 0) + 1;
  }

  const valores = Object.values(contagemValores);

  if (valores.includes(4)) {
    return { nomeJogada: 'quadra', pontosBase: 100, multiplicadorBase: 7 };
  }
  if (valores.includes(3) && valores.includes(2)) {
    return { nomeJogada: 'full-house', pontosBase: 80, multiplicadorBase: 6 };
  }
  if (valores.includes(3)) {
    return { nomeJogada: 'trinca', pontosBase: 40, multiplicadorBase: 3 };
  }
  const pares = valores.filter(v => v === 2).length;
  if (pares === 2) {
    return { nomeJogada: 'dois-pares', pontosBase: 20, multiplicadorBase: 2 };
  }
  if (pares === 1) {
    return { nomeJogada: 'par', pontosBase: 10, multiplicadorBase: 1.5 };
  }

  // Se nenhuma jogada for encontrada
  return { nomeJogada: 'carta-alta', pontosBase: 0, multiplicadorBase: 1 };
};