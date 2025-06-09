import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

interface Props {
   confettiRef: React.RefObject<ConfettiCannon | null>;
  jogada: string;
  style: any;
}

export const GameAnimations: React.FC<Props> = ({ confettiRef, jogada, style }) => (
  <>
    <Animated.View style={[styles.jogadaContainer, style]}>
      <Text style={styles.jogadaText}>{jogada}!</Text>
    </Animated.View>
    <ConfettiCannon ref={confettiRef} count={200} origin={{ x: -10, y: 0 }} autoStart={false} fadeOut={true} />
  </>
);

const styles = {
    jogadaContainer: { position: 'absolute', top: '40%', backgroundColor: 'rgba(255, 215, 0, 0.9)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, borderWidth: 2, borderColor: '#fff' },
    jogadaText: { fontFamily: 'Lato_700Bold', fontSize: 32, color: '#333' }
};