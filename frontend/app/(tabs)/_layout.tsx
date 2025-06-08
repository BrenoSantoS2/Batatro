// app/(tabs)/_layout.js
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones prontos!

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue', // Cor do ícone ativo
      }}>
      <Tabs.Screen
        name="game" // O nome do nosso arquivo renomeado
        options={{
          title: 'Jogo', // O texto que aparece na aba
          tabBarIcon: ({ color }) => <Ionicons name="game-controller-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="modifiers" // O nome do nosso segundo arquivo
        options={{
          title: 'Modificadores', // O texto que aparece na aba
          tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}