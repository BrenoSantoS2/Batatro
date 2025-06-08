// frontend/app/(tabs)/jogo.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { Carta, gerarMao } from '../../utils/baralho';
import { analisarMao } from '../../utils/pontuacao';
import { getJogador, getModificadores } from '../../services/api';
import { Modificador } from '../../types/types';
import CartaView from '@/components/CartaView';

export default function TelaJogo() {
  const [mao, setMao] = useState<Carta[]>([]);
  const [pontuacao, setPontuacao] = useState(0);
  const [modificadoresAtivos, setModificadoresAtivos] = useState<Modificador[]>([]);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados iniciais (mão e modificadores do jogador)
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setLoading(true);
      // Pega os dados do jogador e todos os modificadores disponíveis
      const jogadorData = await getJogador();
      const todosModificadores = await getModificadores();

      if (jogadorData && todosModificadores.length > 0) {
        // Filtra a lista de todos os modificadores para pegar só os que o jogador tem
        const equipados = todosModificadores.filter(mod => 
          jogadorData.modificadores_equipados.includes(mod.id)
        );
        setModificadoresAtivos(equipados);
      }
      
      setMao(gerarMao());
      setLoading(false);
    };

    carregarDadosIniciais();
  }, []);

  const novaMao = () => {
    setMao(gerarMao());
    setPontuacao(0);
  };

  const calcularPontuacao = () => {
    // 1. Análise base da mão para obter pontos e multiplicador
    const resultadoBase = analisarMao(mao);
    let pontos = resultadoBase.pontosBase;
    let multiplicador = resultadoBase.multiplicadorBase;

    console.log(`Jogada Base: ${resultadoBase.nomeJogada}, Pontos: ${pontos}, Multiplicador: ${multiplicador}`);

    // 2. Aplicar efeitos dos modificadores
    modificadoresAtivos.forEach(mod => {
      console.log(`Aplicando modificador: ${mod.nome}`);
      const efeito = mod.efeito;

      switch (efeito.tipo) {
        case 'BONUS_PONTOS_FIXO':
          pontos += efeito.valor;
          console.log(`  +${efeito.valor} pontos (total: ${pontos})`);
          break;
        
        case 'BONUS_POR_NAIPE':
          const contagemNaipe = mao.filter(c => c.naipe === efeito.naipe).length;
          const bonusNaipe = contagemNaipe * efeito.valor;
          pontos += bonusNaipe;
          console.log(`  Encontradas ${contagemNaipe} cartas de ${efeito.naipe}. Bonus de +${bonusNaipe} pontos (total: ${pontos})`);
          break;

        case 'BONUS_POR_JOGADA':
          if (resultadoBase.nomeJogada === efeito.jogada) {
            pontos += efeito.valor;
            console.log(`  Bonus de jogada '${efeito.jogada}' aplicado. +${efeito.valor} pontos (total: ${pontos})`);
          }
          break;
        
        case 'MULTIPLICADOR_FINAL':
          multiplicador *= efeito.valor;
          console.log(`  Multiplicador aumentado para x${multiplicador}`);
          break;
      }
    });

    // 3. Cálculo final e atualização do estado
    const pontuacaoFinal = Math.round(pontos * multiplicador);
    setPontuacao(pontuacaoFinal);
    console.log(`Pontuação Final: ${pontos} * ${multiplicador} = ${pontuacaoFinal}`);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Modificadores Ativos</Text>
        <View style={styles.modificadoresContainer}>
          {modificadoresAtivos.map(mod => (
            <Text key={mod.id} style={styles.modificadorText}>• {mod.nome}</Text>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.title}>Sua Mão</Text>
        <View style={styles.maoContainer}>
          {mao.map((carta, index) => <CartaView key={index} carta={carta} />)}
        </View>
      </View>

      <View style={styles.pontuacaoContainer}>
        <Text style={styles.pontuacaoLabel}>Pontuação</Text>
        <Text style={styles.pontuacaoValor}>{pontuacao}</Text>
      </View>

      <View style={styles.botoesContainer}>
        <Button title="Calcular Pontuação" onPress={calcularPontuacao} />
        <View style={{ marginVertical: 5 }} /> 
        <Button title="Comprar Nova Mão" onPress={novaMao} color="#841584" />
      </View>
    </View>
  );
}

// ATENÇÃO: Adicione os novos estilos!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modificadoresContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 20,
  },
  modificadorText: {
    fontSize: 16,
  },
  maoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pontuacaoContainer: {
    alignItems: 'center',
  },
  pontuacaoLabel: {
    fontSize: 20,
    color: '#666',
  },
  pontuacaoValor: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  botoesContainer: {
    width: '80%',
  },
});