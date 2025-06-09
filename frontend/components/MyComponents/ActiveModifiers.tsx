import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Modificador } from '@/types/types';

interface Props { modificadores: Modificador[]; }

export const ActiveModifiers: React.FC<Props> = ({ modificadores }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Modificadores Ativos</Text>
    <View style={styles.imageContainer}>
      {modificadores.length > 0 ? (
        modificadores.map(mod => <Image key={mod.id} source={{ uri: mod.imagem_url }} style={styles.modificadorImage} />)
      ) : (
        <Text style={styles.modificadorText}>Nenhum modificador equipado</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'Lato_700Bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  imageContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, minHeight: 70, marginBottom: 20 },
  modificadorText: { fontSize: 16, fontFamily: 'Lato_400Regular', color: '#ecf0f1' },
  modificadorImage: { width: 50, height: 50, borderRadius: 8, marginHorizontal: 5, borderWidth: 2, borderColor: '#ffd700' },
});