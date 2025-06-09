// utils/pontuacao.ts
import { Carta } from './baralho';

export interface ResultadoPontuacao {
  nomeJogada: string;
  pontosBase: number;
  multiplicadorBase: number;
}

const valorCartaParaNumero = (valor: string): number => {
    if (valor === 'A') return 14;
    if (valor === 'K') return 13;
    if (valor === 'Q') return 12;
    if (valor === 'J') return 11;
    return parseInt(valor, 10);
};

export const analisarMao = (mao: Carta[]): ResultadoPontuacao => {
  const contagemValores: { [key: string]: number } = {};
  const contagemNaipes: { [key: string]: number } = {};
  const valoresNumericos = mao.map(c => valorCartaParaNumero(c.valor)).sort((a, b) => a - b);
  
  for (const carta of mao) {
    contagemValores[carta.valor] = (contagemValores[carta.valor] || 0) + 1;
    contagemNaipes[carta.naipe] = (contagemNaipes[carta.naipe] || 0) + 1;
  }

  const valoresContagem = Object.values(contagemValores);
  const naipesContagem = Object.values(contagemNaipes);

  const isFlush = naipesContagem.includes(5);
  // Verifica se os valores são consecutivos
  const isStraight = valoresNumericos.every((num, i) => i === 0 || num === valoresNumericos[i-1] + 1) ||
                     // Caso especial do A-2-3-4-5
                     JSON.stringify(valoresNumericos) === JSON.stringify([2,3,4,5,14]);

  // Checa as jogadas da mais forte para a mais fraca
  if (isStraight && isFlush) {
    return { nomeJogada: 'straight-flush', pontosBase: 200, multiplicadorBase: 12 };
  }
  if (valoresContagem.includes(4)) {
    return { nomeJogada: 'quadra', pontosBase: 100, multiplicadorBase: 7 };
  }
  if (valoresContagem.includes(3) && valoresContagem.includes(2)) {
    return { nomeJogada: 'full-house', pontosBase: 80, multiplicadorBase: 6 };
  }
  if (isFlush) {
    return { nomeJogada: 'flush', pontosBase: 60, multiplicadorBase: 5 };
  }
  if (isStraight) {
    return { nomeJogada: 'straight', pontosBase: 50, multiplicadorBase: 4 };
  }
  if (valoresContagem.includes(3)) {
    return { nomeJogada: 'trinca', pontosBase: 40, multiplicadorBase: 3 };
  }
  const pares = valoresContagem.filter(v => v === 2).length;
  if (pares === 2) {
    return { nomeJogada: 'dois-pares', pontosBase: 20, multiplicadorBase: 2 };
  }
  if (pares === 1) {
    return { nomeJogada: 'par', pontosBase: 10, multiplicadorBase: 1.5 };
  }

  return { nomeJogada: 'carta-alta', pontosBase: 5, multiplicadorBase: 1 };
};