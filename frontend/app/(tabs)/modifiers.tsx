// frontend/app/(tabs)/modificadores.tsx
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  getModificadores,
  getJogador,
  updateJogador,
} from "../../services/api";
import { Modificador, Jogador } from "../../types/types";

const MAX_EQUIPADOS = 3;

// --- COMPONENTE DE ITEM DA LISTA (Separado para clareza) ---
interface ModificadorItemProps {
  item: Modificador;
  jogador: Jogador | null;
  onSelect: (id: number) => void;
}

const ModificadorItem: React.FC<ModificadorItemProps> = ({
  item,
  jogador,
  onSelect,
}) => {
  // Se o jogador não "possui" o modificador, não renderiza nada.
  // A '?? false' é uma segurança caso 'jogador' seja nulo.
  const isComprado =
    jogador?.modificadores_comprados.includes(item.id) ?? false;
  if (!isComprado) {
    return null;
  }

  const isEquipado =
    jogador?.modificadores_equipados.includes(item.id) ?? false;

  return (
    <TouchableOpacity onPress={() => onSelect(item.id)}>
      <View
        style={[
          styles.itemContainer,
          isEquipado ? styles.itemEquipado : styles.itemNaoEquipado,
        ]}
      >
        <Image source={{ uri: item.imagem_url }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.nome}</Text>
          <Text style={styles.description}>{item.descricao}</Text>
        </View>
        {isEquipado && <Text style={styles.equipadoText}>EQUIPADO</Text>}
      </View>
    </TouchableOpacity>
  );
};

// --- TELA PRINCIPAL ---
export default function TelaModificadores() {
  const [todosModificadores, setTodosModificadores] = useState<Modificador[]>(
    []
  );
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [loading, setLoading] = useState(true);

  // VERSÃO CORRIGIDA
  useFocusEffect(
    useCallback(() => {
      // A função async é definida DENTRO do callback
      const carregarDados = async () => {
        setLoading(true);
        try {
          const [mods, jog] = await Promise.all([
            getModificadores(),
            getJogador(),
          ]);
          setTodosModificadores(mods || []);
          setJogador(jog);
        } catch (error) {
          console.error(
            "Erro ao carregar dados na tela de modificadores:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

      // E chamada imediatamente
      carregarDados();
    }, []) // O array de dependências do useCallback continua vazio
  );

  const handleSelectModificador = async (modId: number) => {
    if (!jogador) return;

    const equipados = [...jogador.modificadores_equipados];
    const isEquipado = equipados.includes(modId);

    let novosEquipados: number[];

    if (isEquipado) {
      novosEquipados = equipados.filter((id) => id !== modId);
    } else {
      if (equipados.length >= MAX_EQUIPADOS) {
        Alert.alert(
          "Limite Atingido",
          `Você só pode equipar até ${MAX_EQUIPADOS} modificadores.`
        );
        return;
      }
      novosEquipados = [...equipados, modId];
    }

    // Atualiza o estado local primeiro para uma UI mais rápida
    const jogadorParaAtualizar = {
      ...jogador,
      modificadores_equipados: novosEquipados,
    };
    setJogador(jogadorParaAtualizar);

    // Envia a atualização para o backend
    await updateJogador(jogadorParaAtualizar);
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando Modificadores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Loja de Modificadores</Text>
        <Text style={styles.subHeader}>
          Equipados: {jogador?.modificadores_equipados.length || 0} /{" "}
          {MAX_EQUIPADOS}
        </Text>
      </View>

      <FlatList
        data={todosModificadores}
        // A chave de cada item
        keyExtractor={(item) => item.id.toString()}
        // Como renderizar cada item
        renderItem={({ item }) => (
          <ModificadorItem
            item={item}
            jogador={jogador}
            onSelect={handleSelectModificador}
          />
        )}
        // Prop crucial: força a re-renderização quando o jogador muda
        extraData={jogador}
        // Estilo do container da lista
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        // Componente para mostrar se a lista estiver vazia
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text>Nenhum modificador encontrado.</Text>
          </View>
        }
      />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "gray" },
  headerContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  header: { fontSize: 24, fontFamily: "Lato_700Bold", textAlign: "center" },
  subHeader: {
    fontSize: 16,
    fontFamily: "Lato_400Regular",
    color: "gray",
    textAlign: "center",
    marginTop: 4,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  itemEquipado: {
    borderColor: "#27ae60",
    shadowColor: "#27ae60",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  itemNaoEquipado: { borderColor: "#e0e0e0" },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  textContainer: { flex: 1, justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Lato_700Bold", color: "#333" },
  description: {
    fontSize: 14,
    fontFamily: "Lato_400Regular",
    color: "#666",
    marginTop: 4,
  },
  equipadoText: {
    color: "#27ae60",
    fontFamily: "Lato_700Bold",
    paddingHorizontal: 10,
  },
});
