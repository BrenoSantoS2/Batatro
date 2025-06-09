import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { pontuacao: number; }

export const ScoreDisplay: React.FC<Props> = ({ pontuacao }) => (
  <View style={styles.pontuacaoContainer}>
    <Text style={styles.pontuacaoLabel}>Pontuação</Text>
    <Text style={styles.pontuacaoValor}>{pontuacao}</Text>
  </View>
);

const styles = StyleSheet.create({
  pontuacaoContainer: { alignItems: 'center' },
  pontuacaoLabel: { fontSize: 22, fontFamily: 'Lato_400Regular', color: '#ecf0f1' },
  pontuacaoValor: { fontSize: 52, fontFamily: 'Lato_700Bold', color: '#fff' },
});