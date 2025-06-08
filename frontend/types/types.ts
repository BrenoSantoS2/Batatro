export interface Efeito {
  tipo: string;
  naipe?: string;
  valor: number;
  jogada?: string;
}

export interface Modificador {
  id: number;
  nome: string;
  descricao: string;
  imagem_url: string;
  efeito: Efeito;
}

export interface Jogador {
  id: number;
  dinheiro: number;
  modificadores_equipados: number[];
}