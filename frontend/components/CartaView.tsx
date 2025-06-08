// frontend/app/components/CartaView.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Carta } from '@/utils/baralho';

// Define os símbolos e cores para cada naipe
const naipesInfo = {
  espadas: { simbolo: '♠', cor: 'black' },
  paus: { simbolo: '♣', cor: 'black' },
  copas: { simbolo: '♥', cor: 'red' },
  ouros: { simbolo: '♦', cor: 'red' },
};

interface CartaViewProps {
  carta: Carta;
}

const CartaView: React.FC<CartaViewProps> = ({ carta }) => {
  const info = naipesInfo[carta.naipe];

  return (
    <View style={styles.card}>
      <Text style={[styles.text, { color: info.cor }]}>
        {carta.valor} {info.simbolo}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    width: 60,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CartaView;