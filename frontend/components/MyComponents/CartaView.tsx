// frontend/app/components/CartaView.tsx
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { Carta } from '../../utils/baralho';

const naipesInfo = {
  espadas: { simbolo: '♠', cor: 'black' },
  paus: { simbolo: '♣', cor: 'black' },
  copas: { simbolo: '♥', cor: 'red' },
  ouros: { simbolo: '♦', cor: 'red' },
};

interface CartaViewProps {
  carta: Carta;
  index: number; // Precisamos do índice para criar um delay na animação
}

const CartaView: React.FC<CartaViewProps> = ({ carta, index }) => {
  const info = naipesInfo[carta.naipe];

  // Valores compartilhados para a animação
  const rotate = useSharedValue(180); // Começa "virada"
  const opacity = useSharedValue(0);  // Começa invisível
  const translateY = useSharedValue(50); // Começa um pouco para baixo

  // Estilo animado
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { perspective: 1000 }, // Necessário para a rotação 3D parecer correta
        { rotateY: `${rotate.value}deg` },
      ],
    };
  });

  // Dispara a animação quando o componente monta
  useEffect(() => {
    // Atraso baseado no índice da carta para um efeito de "cascata"
    const delay = index * 150; 

    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    rotate.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, [carta]); // A animação roda de novo se a carta mudar (ao comprar nova mão)

  // Usamos o componente animado do Reanimated
  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {/* Usamos um container interno para o conteúdo, pois o 'transform' afeta os filhos */}
      <Animated.Text style={[styles.text, { color: info.cor }]}>
        {carta.valor} {info.simbolo}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 5,
    width: 60,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CartaView;