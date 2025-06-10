// frontend/services/api.ts
import axios from 'axios';
import { Modificador, Jogador } from '../types/types'; // Importamos nosso tipo!

const API_BASE_URL = 'http://10.128.1.73:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getModificadores = async (): Promise<Modificador[]> => {
  try {
    const response = await apiClient.get('/modificadores');
    console.log("SUCCESS: Modificadores recebidos da API:", response.data); // Log de sucesso
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log detalhado para erros do Axios
      console.error('ERRO AXIOS ao buscar modificadores:', error.toJSON());
    } else {
      // Log para outros tipos de erro
      console.error('ERRO GENÉRICO ao buscar modificadores:', error);
    }
    return []; 
  }
};

export const getJogador = async (): Promise<Jogador | null> => {
  try {
    const response = await apiClient.get('/jogador');
    console.log("SUCCESS: Jogador recebido da API:", response.data); // Log de sucesso
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('ERRO AXIOS ao buscar jogador:', error.toJSON());
    } else {
      console.error('ERRO GENÉRICO ao buscar jogador:', error);
    }
    return null;
  }
};

export const updateJogador = async (jogadorData: Jogador): Promise<Jogador | null> => {
  try {
    const response = await apiClient.put('/jogador', jogadorData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar dados do jogador:', error);
    return null;
  }
};