// frontend/hooks/useGameAnimations.ts
import { useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ResultadoPontuacao } from '@/utils/pontuacao';

export const useGameAnimations = () => {
  const confettiRef = useRef<ConfettiCannon>(null);
  const jogadaOpacity = useSharedValue(0);
  const jogadaScale = useSharedValue(0.5);

  const jogadaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: jogadaOpacity.value,
    transform: [{ scale: jogadaScale.value }],
  }));

  const triggerAnimations = (resultadoBase: ResultadoPontuacao) => {
    jogadaScale.value = 0.5;
    jogadaOpacity.value = 0;
    jogadaScale.value = withTiming(1.2, { duration: 200 });
    jogadaOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 1500 })
    );

    if (resultadoBase.pontosBase >= 50) {
      confettiRef.current?.start();
    }
  };

  return { confettiRef, jogadaAnimatedStyle, triggerAnimations };
};