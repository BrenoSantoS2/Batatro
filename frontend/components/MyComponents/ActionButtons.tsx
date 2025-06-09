// frontend/app/components/ActionButtons.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton } from './StyledButton'; // Importa nosso novo botão

interface Props {
  onJogar: () => void;
  onDescartar: () => void;
  podeDescartar: boolean;
}

export const ActionButtons: React.FC<Props> = ({ onJogar, onDescartar, podeDescartar }) => (
  <View style={styles.container}>
    <StyledButton
      title="Descartar"
      onPress={onDescartar}
      type="secondary"
      disabled={!podeDescartar}
    />
    <StyledButton
      title="Jogar Mão"
      onPress={onJogar}
      type="primary"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Botões lado a lado
    justifyContent: 'center',
    width: '100%',
  },
});