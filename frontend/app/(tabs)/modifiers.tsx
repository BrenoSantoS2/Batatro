// frontend/app/(tabs)/modificadores.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { getModificadores } from '../../services/api'; // Importamos nossa função
import { Modificador } from '../../types/types'; // E nosso tipo

export default function TelaModificadores() {
  const [modificadores, setModificadores] = useState<Modificador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await getModificadores();
        setModificadores(dados);
      } catch (error) {
        // O erro já é logado no nosso serviço de api
        // Aqui poderíamos mostrar uma mensagem de erro na tela
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []); // O array vazio significa que este efeito roda apenas uma vez, quando o componente monta

  // Se estiver carregando, mostra um indicador
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderiza um item da lista
  const renderItem = ({ item }: { item: Modificador }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagem_url }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nome}</Text>
        <Text style={styles.description}>{item.descricao}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={modificadores}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});