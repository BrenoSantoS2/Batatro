import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Carta } from '@/utils/baralho';
import CartaView from './CartaView';

interface Props { mao: Carta[]; }

export const HandDisplay: React.FC<Props> = ({ mao }) => (
  <View>
    <Text style={styles.title}>Sua Mão</Text>
    <View style={styles.maoContainer}>
      {mao.map((carta, index) => (
        <CartaView key={`${carta.valor}-${carta.naipe}-${index}`} carta={carta} index={index} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: 'Lato_700Bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  maoContainer: { flexDirection: 'row', justifyContent: 'center' },
});