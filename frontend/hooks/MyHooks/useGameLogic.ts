// frontend/hooks/useGameLogic.ts
import { useState, useCallback, useEffect } from "react"; // Adicione useEffect
import { useFocusEffect } from "expo-router";
import { Carta, gerarMao } from "@/utils/baralho";
import { analisarMao, ResultadoPontuacao } from "@/utils/pontuacao";
import { getJogador, updateJogador, getModificadores } from "@/services/api";
import { Modificador, Jogador } from "@/types/types";

// Estado inicial para quando o jogo for reiniciado
const ESTADO_INICIAL_JOGADOR: Jogador = {
  id: 1,
  dinheiro: 100,
  modificadores_comprados: [1, 2, 3, 4],
  modificadores_equipados: [1],
  ante_atual: 1,
  meta_pontos: 300,
  maos_por_ante: 4,
  maos_restantes: 4,
};

export const useGameLogic = () => {
  // --- STATES DO JOGO ---
  const [mao, setMao] = useState<Carta[]>([]);
  const [pontuacao, setPontuacao] = useState(0);
  const [modificadoresAtivos, setModificadoresAtivos] = useState<Modificador[]>(
    []
  );
  const [jogador, setJogador] = useState<Jogador>(ESTADO_INICIAL_JOGADOR);
  const [loading, setLoading] = useState(true);
  const [isGameOver, setGameOver] = useState(false);

  // --- FUNÇÕES DE LÓGICA PURA ---
  const calcularPontuacaoAtual = (
    maoAtual: Carta[],
    modificadores: Modificador[]
  ): number => {
    if (maoAtual.length !== 5) return 0;

    const resultadoBase = analisarMao(maoAtual);
    let pontos = resultadoBase.pontosBase;
    let multiplicador = resultadoBase.multiplicadorBase;

    modificadores.forEach((mod) => {
      const { efeito } = mod;
      switch (efeito.tipo) {
        case "BONUS_PONTOS_FIXO":
          pontos += efeito.valor;
          break;
        case "BONUS_POR_NAIPE":
          pontos +=
            maoAtual.filter((c) => c.naipe === efeito.naipe).length *
            efeito.valor;
          break;
        case "BONUS_POR_JOGADA":
          if (resultadoBase.nomeJogada === efeito.jogada)
            pontos += efeito.valor;
          break;
        case "MULTIPLICADOR_FINAL":
          multiplicador *= efeito.valor;
          break;
      }
    });
    return Math.round(pontos * multiplicador);
  };

  const novaMao = () => {
    setMao(gerarMao());
  };

  // --- EFEITOS (Hooks que reagem a mudanças) ---

  // Roda sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        console.log("--- Foco na tela, carregando dados ---");
        setLoading(true);
        const [jogadorData, todosModificadores] = await Promise.all([
          getJogador(),
          getModificadores(),
        ]);

        console.log("Dados brutos recebidos:", {
          jogadorData,
          todosModificadores,
        });

        if (
          jogadorData &&
          todosModificadores &&
          todosModificadores.length > 0
        ) {
          const equipados = todosModificadores.filter((mod) =>
            jogadorData.modificadores_equipados.includes(mod.id)
          );

          console.log(
            "Modificadores que serão setados como ATIVOS:",
            equipados
          );
          setModificadoresAtivos(equipados);
          setJogador(jogadorData);
          setGameOver(jogadorData.maos_restantes <= 0);
        } else {
          console.log(
            "ERRO: jogadorData ou todosModificadores estão vazios/nulos."
          );
        }
        novaMao();
        setLoading(false);
      };
      carregarDados();
    }, [])
  );

  // NOVO: Roda sempre que a mão ou os modificadores mudam para calcular a pontuação
  useEffect(() => {
    if (!loading && mao.length === 5) {
      const pontuacaoCalculada = calcularPontuacaoAtual(
        mao,
        modificadoresAtivos
      );
      setPontuacao(pontuacaoCalculada);
    }
  }, [mao, modificadoresAtivos, loading]);

  // --- AÇÕES DO JOGADOR ---

  const jogarMao = async (): Promise<{
    resultadoBase: ResultadoPontuacao;
    venceu: boolean;
  }> => {
    const resultadoBase = analisarMao(mao);

    // Compara a pontuação JÁ CALCULADA com a meta
    if (pontuacao >= jogador.meta_pontos) {
      // VENCEU O ANTE!
      const proximoAnte = jogador.ante_atual + 1;
      const proximaMeta = Math.floor(jogador.meta_pontos * 1.8);
      const jogadorAtualizado = {
        ...jogador,
        ante_atual: proximoAnte,
        meta_pontos: proximaMeta,
        maos_restantes: jogador.maos_por_ante,
        dinheiro: jogador.dinheiro + 5 * jogador.ante_atual,
      };
      await updateJogador(jogadorAtualizado);
      setJogador(jogadorAtualizado);
      novaMao(); // Prepara para a próxima rodada
      return { resultadoBase, venceu: true };
    } else {
      // FALHOU A MÃO, perde uma tentativa
      const maosRestantes = jogador.maos_restantes - 1;
      const jogadorAtualizado = { ...jogador, maos_restantes: maosRestantes };
      await updateJogador(jogadorAtualizado);
      setJogador(jogadorAtualizado);

      if (maosRestantes <= 0) {
        setGameOver(true);
      } else {
        novaMao(); // Compra uma nova mão para a próxima tentativa
      }
      return { resultadoBase, venceu: false };
    }
  };

  const descartarMao = async () => {
    // Não pode descartar se só tiver 1 mão ou se o jogo acabou
    if (jogador.maos_restantes <= 1 || isGameOver) return;

    const maosRestantes = jogador.maos_restantes - 1;
    const jogadorAtualizado = { ...jogador, maos_restantes: maosRestantes };
    await updateJogador(jogadorAtualizado);
    setJogador(jogadorAtualizado);
    novaMao();
  };

  const reiniciarJogo = async () => {
    setLoading(true);
    await updateJogador(ESTADO_INICIAL_JOGADOR); // Reseta o backend
    setJogador(ESTADO_INICIAL_JOGADOR); // Reseta o estado local
    setGameOver(false);
    novaMao();
    setLoading(false);
  };

  // --- VALORES RETORNADOS PARA A UI ---
  return {
    mao,
    pontuacao,
    modificadoresAtivos,
    jogador,
    loading,
    isGameOver,
    jogarMao,
    descartarMao,
    reiniciarJogo,
  };
};
