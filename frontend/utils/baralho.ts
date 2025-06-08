
export interface Carta {
  naipe: 'paus' | 'ouros' | 'copas' | 'espadas';
  valor: string; // 'A', '2', '3', ..., '10', 'J', 'Q', 'K'
}

const NAIPES: Carta['naipe'][] = ['paus', 'ouros', 'copas', 'espadas'];
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Função que gera uma mão aleatória de 5 cartas
export const gerarMao = (): Carta[] => {
  const mao: Carta[] = [];
  const cartasUsadas = new Set<string>(); // Para não repetir cartas

  while (mao.length < 5) {
    const naipeAleatorio = NAIPES[Math.floor(Math.random() * NAIPES.length)];
    const valorAleatorio = VALORES[Math.floor(Math.random() * VALORES.length)];

    const cartaId = `${valorAleatorio}-${naipeAleatorio}`;
    
    if (!cartasUsadas.has(cartaId)) {
      mao.push({ naipe: naipeAleatorio, valor: valorAleatorio });
      cartasUsadas.add(cartaId);
    }
  }
  return mao;
};