// frontend/app/(tabs)/jogo.tsx
import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';

import { useGameLogic } from '@/hooks/MyHooks/useGameLogic';
import { useGameAnimations } from '@/hooks/MyHooks/useGameAnimations';
import { ObjectiveDisplay } from '@/components/MyComponents/ObjectiveDisplay';
import { ActiveModifiers } from '@/components/MyComponents/ActiveModifiers';
import { HandDisplay } from '@/components/MyComponents/HandDisplay';
import { ScoreDisplay } from '@/components/MyComponents/ScoreDisplay';
import { ActionButtons } from '@/components/MyComponents/ActionButtons';
import { GameAnimations } from '@/components/MyComponents/GameAnimations';
import { StyledButton } from '@/components/MyComponents/StyledButton'; 

export default function TelaJogo() {
  const [jogadaFeita, setJogadaFeita] = useState('');
  const { mao, pontuacao, modificadoresAtivos, jogador, loading, isGameOver, jogarMao, descartarMao, reiniciarJogo } = useGameLogic();
  const { confettiRef, jogadaAnimatedStyle, triggerAnimations } = useGameAnimations();
  
  const [fontsLoaded] = useFonts({ Lato_400Regular, Lato_700Bold });

  const handleJogarMao = async () => {
    const { resultadoBase, venceu } = await jogarMao();
    if (resultadoBase.nomeJogada !== 'carta-alta') {
      const nomeJogada = (venceu ? "ANTE VENCIDO! " : "") + resultadoBase.nomeJogada.replace('-', ' ').toUpperCase();
      setJogadaFeita(nomeJogada);
      triggerAnimations(resultadoBase);
    } else if (venceu) {
      setJogadaFeita("ANTE VENCIDO!");
      triggerAnimations(resultadoBase);
    }
  };

  if (loading || !fontsLoaded) {
    return (
      <LinearGradient colors={['#2c3e50', '#3498db']} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={isGameOver ? ['#7d0c0c', '#3d0606'] : ['#2c3e50', '#3498db']} 
      style={styles.container}
    >
      {isGameOver ? (
        // TELA DE GAME OVER
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>FIM DE JOGO</Text>
          <Text style={styles.gameOverSubTitle}>Você chegou ao Ante {jogador.ante_atual}</Text>
          <StyledButton title="Reiniciar Jogo" onPress={reiniciarJogo} type="primary" />
        </View>
      ) : (
        // TELA PRINCIPAL DO JOGO
        <>
          <View style={styles.topArea}>
            <ObjectiveDisplay ante={jogador.ante_atual} meta={jogador.meta_pontos} maosRestantes={jogador.maos_restantes} />
            <ActiveModifiers modificadores={modificadoresAtivos} />
          </View>

          <View style={styles.centerArea}>
            <HandDisplay mao={mao} />
          </View>
          
          <View style={styles.bottomArea}>
            <ScoreDisplay pontuacao={pontuacao} />
            <ActionButtons onJogar={handleJogarMao} onDescartar={descartarMao} podeDescartar={jogador.maos_restantes > 1} />
          </View>

          <GameAnimations confettiRef={confettiRef} jogada={jogadaFeita} style={jogadaAnimatedStyle} />
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Altera para space-between para empurrar para as bordas
    paddingVertical: 40, // Adiciona padding vertical
  },
  topArea: {
    width: '100%',
    alignItems: 'center',
  },
  centerArea: {
    // Esta área pode crescer ou encolher, o justify-content cuidará do espaço
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
  },
  gameOverContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gameOverTitle: { 
    fontFamily: 'Lato_700Bold', 
    fontSize: 48, 
    color: '#fff', 
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  gameOverSubTitle: { 
    fontFamily: 'Lato_400Regular', 
    fontSize: 20, 
    color: '#ecf0f1', 
    marginBottom: 40,
  },
});