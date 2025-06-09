// frontend/app/(tabs)/modificadores.tsx
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getModificadores, getJogador, updateJogador } from '../../services/api';
import { Modificador, Jogador } from '../../types/types';

const MAX_EQUIPADOS = 3;

// O componente do item não precisa mudar, ele já está correto.
const ModificadorItem: React.FC<{ item: Modificador; isEquipado: boolean; onSelect: (id: number) => void; }> = ({ item, isEquipado, onSelect }) => (
  <TouchableOpacity onPress={() => onSelect(item.id)}>
    <View style={[styles.itemContainer, isEquipado ? styles.itemEquipado : styles.itemNaoEquipado]}>
      <Image source={{ uri: item.imagem_url }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nome}</Text>
        <Text style={styles.description}>{item.descricao}</Text>
      </View>
      {isEquipado && <Text style={styles.equipadoText}>EQUIPADO</Text>}
    </View>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function TelaModificadores() {
  const [todosModificadores, setTodosModificadores] = useState<Modificador[]>([]);
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [loading, setLoading] = useState(true);

  // A forma CORRETA e SEGURA de carregar dados assíncronos em um Effect.
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Flag para evitar atualização de estado em componente desmontado

      const carregarDados = async () => {
        setLoading(true);
        try {
          const [mods, jog] = await Promise.all([getModificadores(), getJogador()]);
          
          if (isActive) { // Só atualiza o estado se o componente ainda estiver montado
            setTodosModificadores(mods || []);
            setJogador(jog);
          }
        } catch (error) {
          console.error("Erro ao carregar dados na tela de modificadores:", error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      carregarDados();

      return () => { // Função de limpeza
        isActive = false;
      };
    }, [])
  );

  const handleSelectModificador = async (modId: number) => {
    if (!jogador) return;

    // Criamos uma cópia do array de IDs equipados para trabalhar de forma imutável
    const equipadosAtuais = [...jogador.modificadores_equipados];
    const isEquipado = equipadosAtuais.includes(modId);

    let novosEquipados: number[];

    if (isEquipado) {
      // Remover: filtra o array para criar um NOVO array sem o ID
      novosEquipados = equipadosAtuais.filter(id => id !== modId);
    } else {
      // Adicionar: checa o limite
      if (equipadosAtuais.length >= MAX_EQUIPADOS) {
        Alert.alert("Limite Atingido", `Você só pode equipar até ${MAX_EQUIPADOS} modificadores.`);
        return;
      }
      // Cria um NOVO array com o novo ID adicionado
      novosEquipados = [...equipadosAtuais, modId];
    }
    
    // Criamos um objeto de jogador COMPLETAMENTE NOVO
    const jogadorAtualizado = { 
      ...jogador, 
      modificadores_equipados: novosEquipados 
    };
    
    // 1. Atualizamos o estado local com o novo objeto (reatividade garantida)
    setJogador(jogadorAtualizado);
    
    // 2. Enviamos o novo objeto para o backend
    await updateJogador(jogadorAtualizado);
  };
  
  if (loading || !jogador) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Selecione seus Modificadores</Text>
        <Text style={styles.subHeader}>
          Equipados: {jogador.modificadores_equipados.length} / {MAX_EQUIPADOS}
        </Text>
      </View>

      <FlatList
        data={todosModificadores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ModificadorItem 
            item={item} 
            isEquipado={jogador.modificadores_equipados.includes(item.id)}
            onSelect={handleSelectModificador} 
          />
        )}
        extraData={jogador.modificadores_equipados} // Essencial para a reatividade do highlight
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.loadingText}>Nenhum modificador disponível.</Text>}
      />
    </View>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8' },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: 'gray' },
    headerContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    header: { fontSize: 24, fontFamily: 'Lato_700Bold', textAlign: 'center' },
    subHeader: { fontSize: 16, fontFamily: 'Lato_400Regular', color: 'gray', textAlign: 'center', marginTop: 4 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, marginVertical: 5, borderRadius: 12, borderWidth: 2, backgroundColor: '#fff' },
    itemEquipado: { borderColor: '#27ae60', shadowColor: "#27ae60", shadowOpacity: 0.4, shadowRadius: 5, elevation: 5, },
    itemNaoEquipado: { borderColor: '#e0e0e0' },
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
    textContainer: { flex: 1, justifyContent: 'center' },
    title: { fontSize: 18, fontFamily: 'Lato_700Bold', color: '#333' },
    description: { fontSize: 14, fontFamily: 'Lato_400Regular', color: '#666', marginTop: 4 },
    equipadoText: { color: '#27ae60', fontFamily: 'Lato_700Bold', paddingHorizontal: 10 }
});