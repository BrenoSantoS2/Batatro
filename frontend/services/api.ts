// frontend/services/api.ts
import axios from 'axios';
import { Modificador, Jogador } from '../types/types'; // Importamos nosso tipo!

const API_BASE_URL = 'http://10.254.19.51:4000'; // Troque SEU_IP_LOCAL pelo seu endereço IP

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getModificadores = async (): Promise<Modificador[]> => {
  try {
    const response = await apiClient.get('/modificadores');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar modificadores:', error);
    return []; 
  }
};

export const getJogador = async (): Promise<Jogador | null> => {
  try {
    const response = await apiClient.get('/jogador');
    return response.data; 
  } catch (error) {
    console.error('Erro ao buscar dados do jogador:', error);
    return null;
  }
};
