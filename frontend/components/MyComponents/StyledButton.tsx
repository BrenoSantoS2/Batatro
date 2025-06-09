// frontend/app/components/StyledButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface Props {
  onPress: () => void;
  title: string;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const StyledButton: React.FC<Props> = ({ onPress, title, type = 'primary', disabled = false }) => {
  const containerStyle: ViewStyle[] = [styles.button];
  const textStyle: TextStyle[] = [styles.text];

  if (type === 'primary') {
    containerStyle.push(styles.primaryContainer);
    textStyle.push(styles.primaryText);
  } else {
    containerStyle.push(styles.secondaryContainer);
    textStyle.push(styles.secondaryText);
  }

  if (disabled) {
    containerStyle.push(styles.disabled);
  }

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle} disabled={disabled}>
      <Text style={textStyle}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    minWidth: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  text: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
  },
  primaryContainer: {
    backgroundColor: '#27ae60', // Verde
  },
  primaryText: {
    color: '#fff',
  },
  secondaryContainer: {
    backgroundColor: '#9b59b6', // Roxo
  },
  secondaryText: {
    color: '#fff',
  },
  disabled: {
    backgroundColor: '#95a5a6', // Cinza
    elevation: 0,
  },
});