// frontend/app/components/ObjectiveDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  ante: number;
  meta: number;
  maosRestantes: number;
}

export const ObjectiveDisplay: React.FC<Props> = ({ ante, meta, maosRestantes }) => (
  <View style={styles.container}>
    <View style={styles.anteContainer}>
      <Text style={styles.anteText}>ANTE {ante}</Text>
    </View>
    <Text style={styles.metaText}>Meta: {meta.toLocaleString('pt-BR')}</Text>
    <Text style={styles.maosText}>Mãos Restantes: {maosRestantes}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  anteContainer: {
    backgroundColor: '#c0392b',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  anteText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: '#fff',
  },
  metaText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color: '#fff',
  },
  maosText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 5,
  },
});