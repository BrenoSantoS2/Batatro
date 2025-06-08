# Projeto Balatro Simplificado

Este projeto é uma implementação de um aplicativo mobile inspirado no jogo [Balatro](https://www.playbalatro.com/), desenvolvido como parte da avaliação da disciplina de [Nome da Disciplina] na [Nome da Universidade].

## Visão Geral

O aplicativo simula a mecânica central do Balatro: o jogador recebe uma mão de cartas, calcula a pontuação baseada em jogadas de pôquer (Par, Trinca, etc.) e aplica os efeitos de modificadores (Coringas) para aumentar a pontuação final.

## Barema de Avaliação Atendido

-   **[X] Implementação de frontend mobile:** Realizada com React Native e Expo.
-   **[X] Armazenamento de modificadores:** Os modificadores são definidos e servidos por um backend mock.
-   **[X] Backend auxiliar:** Utilizado o `json-server` para simular uma API RESTful.
-   **[X] Entrega na plataforma Github:** O projeto está integralmente disponível neste repositório.
-   **[X] Interação com API mocada:** O frontend consome os dados do `json-server` para buscar a lista de modificadores e os dados do jogador.

## Tecnologias Utilizadas

-   **Frontend:** React Native, Expo, TypeScript, Expo Router
-   **Comunicação API:** Axios
-   **Backend (Mock):** `json-server`

## Como Executar o Projeto

### Pré-requisitos

-   Node.js e npm
-   Expo Go instalado no seu dispositivo móvel (iOS ou Android)
-   Computador e dispositivo móvel na mesma rede Wi-Fi

### 1. Backend

Primeiro, inicie o servidor da API mock.

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor (ficará rodando no localhost:4000)
npm start
```

### 2. Frontend

Em um **novo terminal**, inicie o aplicativo.

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# IMPORTANTE: Altere o endereço da API
# Abra o arquivo `frontend/services/api.ts` e altere a variável API_BASE_URL 
# para o endereço IP da máquina que está rodando o backend.
# Ex: const API_BASE_URL = 'http://192.168.1.10:4000';

# Inicie o Expo
npx expo start
```

Após iniciar o Expo, escaneie o QR Code com o aplicativo Expo Go no seu celular.

## Estrutura do Projeto

```
/projeto-balatro
|-- /backend
|   |-- db.json         # "Banco de dados" com os modificadores e jogador
|   |-- package.json
|
|-- /frontend
|   |-- /app            # Telas e navegação (Expo Router)
|   |-- /services       # Lógica de comunicação com a API
|   |-- /utils          # Funções de lógica (baralho, pontuação)
|   |-- /types          # Definições de tipos do TypeScript
|   |-- package.json
|
|-- README.md           # Este arquivo
```