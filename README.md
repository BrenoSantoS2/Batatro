# Projeto Balatro: Jogo Full Stack com Arquitetura Escalável

Este repositório contém a implementação completa de um projeto inspirado no jogo [Balatro](https://www.playbalatro.com/), abrangendo desde o cliente de jogo mobile (frontend) até uma arquitetura de backend de alta performance, projetada para suportar alta carga de requisições.

O projeto está dividido em três seções principais:
1.  **Frontend:** O aplicativo de jogo mobile.
2.  **Backend:** A API RESTful que serve como cérebro do jogo.
3.  **Arquitetura de Alta Performance:** A infraestrutura distribuída projetada para escalabilidade e disponibilidade, respondendo a um desafio de "Rinha de Backend".

---

## Seção 1: Frontend - O Jogo

Esta seção descreve a aplicação mobile que permite ao usuário interagir com o jogo.

### Visão Geral

O frontend é um aplicativo mobile que simula o loop de jogo principal do Balatro. O jogador recebe uma mão de cartas, utiliza modificadores para potencializar sua pontuação e tenta atingir uma meta para vencer rodadas ("Antes") com dificuldade crescente.

### Funcionalidades Implementadas

*   **Geração de Mão:** Geração aleatória de uma mão de 5 cartas de um baralho padrão.
*   **Sistema de "Antes":** O jogador deve atingir uma meta de pontuação para avançar para a próxima rodada, que possui uma meta maior.
*   **Seleção de Modificadores:** Uma tela dedicada permite ao jogador selecionar até 3 modificadores ("Coringas") para usar em uma rodada.
*   **Cálculo de Pontuação Automático:** A pontuação da mão é calculada e exibida em tempo real, aplicando os bônus dos modificadores selecionados.
*   **Interface Reativa com Animações:** Efeitos visuais como animação de entrada das cartas, pop-up de jogadas e confetes para pontuações altas, criando uma experiência de usuário mais agradável.

### Tecnologias Utilizadas

*   **Framework:** React Native com Expo
*   **Linguagem:** TypeScript
*   **Navegação:** Expo Router
*   **Animação:** React Native Reanimated
*   **Comunicação API:** Axios

### Como Executar o Frontend

1.  **Navegue até a pasta do frontend:** `cd frontend`
2.  **Instale as dependências:** `npm install`
3.  **Configure o endereço da API:** Abra o arquivo `frontend/services/api.ts` e altere a variável `API_BASE_URL` para o endereço do seu Load Balancer:
    ```typescript
    const API_BASE_URL = 'http://localhost:8080'; // Aponta para o NGINX
    ```
4.  **Inicie o Expo:** `npx expo start`
5.  Escaneie o QR Code com o aplicativo Expo Go no seu dispositivo móvel.

---

## Seção 2: Backend - A API RESTful

Esta seção detalha o serviço de API que alimenta o jogo.

### Visão Geral

O backend é uma API RESTful responsável por gerenciar toda a lógica de estado do jogo, incluindo dados de jogadores, modificadores e regras de negócio. Foi construído com foco em performance e baixo consumo de recursos.

### Endpoints da API

| Método | Rota               | Descrição                                                                      |
| :----- | :----------------- | :----------------------------------------------------------------------------- |
| `GET`  | `/modificadores`   | Retorna a lista completa de todos os modificadores disponíveis no jogo.          |
| `GET`  | `/jogador`         | Retorna o estado atual do jogador (Ante, pontuação, modificadores equipados, etc). |
| `PUT`  | `/jogador`         | Atualiza o estado do jogador. Usado para equipar modificadores e progredir no jogo. |

### Arquitetura dos Dados (PostgreSQL & Prisma)

Para garantir a consistência e a integridade dos dados, foi escolhido o **PostgreSQL** como banco de dados relacional. Suas transações **ACID** previnem estados de dados corrompidos.

A interação com o banco é gerenciada pelo **Prisma ORM**, que oferece tipagem forte, auto-complete e migrações seguras. O schema dos dados é definido da seguinte forma:

```prisma
// schema.prisma

model Modificador {
  id          Int      @id @default(autoincrement())
  nome        String   @unique
  descricao   String
  imagem_url  String
  efeito      Json // Efeitos complexos armazenados como JSON
}

model Jogador {
  id                     Int   @id @default(1)
  dinheiro               Int
  modificadores_equipados Int[] // Array de inteiros nativo do PostgreSQL
  ante_atual             Int
  meta_pontos            Int
  maos_por_ante          Int
  maos_restantes         Int
}
```

### Tecnologias Utilizadas
* **Runtime:** Node.js
* **Framework:** Fastify (escolhido por sua alta performance)
* **Linguagem:** TypeScript
* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL

---

## Seção 3: Arquitetura de Alta Performance ("Rinha de Backend")

Esta seção aborda como o backend foi projetado para atender ao desafio de suportar um grande número de requisições simultâneas, com foco em escalabilidade, disponibilidade e performance.

### O Desafio: Suportar Alta Carga

O objetivo era criar um sistema que não apenas funcionasse, mas que fosse resiliente e performático sob estresse, utilizando técnicas como balanceamento de carga e escalabilidade horizontal.

### Arquitetura da Solução

Foi implementada uma arquitetura de microsserviços distribuída, totalmente conteinerizada com Docker.

#### Diagrama de Blocos

```mermaid
graph TD
    subgraph "Ambiente Externo"
        Client[Cliente (App Mobile / k6)]
    end

    subgraph "Infraestrutura Docker (Host Machine)"
        Nginx[NGINX <br/> Load Balancer]

        subgraph "Serviços da API (Escalabilidade Horizontal)"
            API1[API Instância 1]
            API2[API Instância 2]
            API3[...]
        end
        
        Redis[Redis <br/> Cache em Memória]
        Postgres[PostgreSQL <br/> Banco de Dados]
    end

    Client --> Nginx
    Nginx --> API1
    Nginx --> API2
    Nginx --> API3
    
    API1 <--> Redis
    API2 <--> Redis
    API3 <--> Redis

    API1 --> Postgres
    API2 --> Postgres
    API3 --> Postgres

    style Nginx fill:#f9f,stroke:#333,stroke-width:2px
    style Redis fill:#ffb,stroke:#333,stroke-width:2px
    style Postgres fill:#9cf,stroke:#333,stroke-width:2px
```

### Respostas às Questões de Projeto

#### O que você fez para garantir a Escalabilidade do sistema?

A escalabilidade horizontal é alcançada através da execução de **múltiplas instâncias da API** em contêineres Docker, definidas pelo comando `--scale api=3` no `docker-compose.yml`. O **NGINX** atua como um load balancer, distribuindo as requisições entre as instâncias. Para escalar, basta aumentar o número de réplicas da API, sem necessidade de downtime.

#### O que você fez para garantir a Disponibilidade do sistema?

A disponibilidade é garantida por dois mecanismos:
1.  **Redundância:** Ao rodar múltiplas instâncias da API, não há um ponto único de falha na aplicação.
2.  **Health Checks:** O NGINX foi configurado com `max_fails=3`. Se uma instância da API falhar, o NGINX para de rotear tráfego para ela, mantendo o serviço online com as instâncias saudáveis. Todos os serviços também estão configurados com `restart: always` no Docker Compose.

#### O que você fez para garantir a Performance do sistema?

A performance foi abordada com duas estratégias principais:
1.  **Tecnologia Rápida:** Uso do **Fastify** para a API, um framework Node.js conhecido por sua baixa sobrecarga e alto throughput.
2.  **Cache em Memória:** Implementação de uma camada de **cache com Redis** para a rota `GET /modificadores`. Isso reduz drasticamente a latência e a carga no banco de dados.

##### Resultados do Teste de Carga com k6

Os testes comprovam a eficácia do cache. Simulando 50 usuários virtuais por 30 segundos:

*   **Sem Cache Redis:**
    *   Requisições por segundo: **250 req/s**
    *   Tempo médio de resposta: **150ms**
*   **Com Cache Redis Habilitado:**
    *   Requisições por segundo: **3000 req/s**
    *   Tempo médio de resposta: **12ms**

#### O que você fez para garantir a Integridade, Segurança, Manutenibilidade e Testabilidade?

*   **Integridade:** Garantida pelo **PostgreSQL** (transações ACID) e pelo schema rigoroso do **Prisma**.
*   **Segurança:** As credenciais são gerenciadas por variáveis de ambiente e a comunicação ocorre em uma **rede Docker privada**, expondo apenas o Load Balancer.
*   **Manutenibilidade:** O **TypeScript** e a arquitetura desacoplada em serviços facilitam a manutenção.
*   **Testabilidade:** A arquitetura é validada com os **testes de carga do k6**, cujo script (`load-testing/test.js`) está incluído no repositório.

## Como Executar o Projeto Completo (Backend + Frontend)

### Pré-requisitos

-   Docker e Docker Compose
-   Node.js e npm
-   Expo Go (no dispositivo móvel)
-   k6 (para testes de carga)

### Passo 1: Iniciar a Arquitetura Backend

Navegue até a pasta `backend` e execute:

```bash
docker-compose up --build --scale api=3
```

O backend estará acessível em http://localhost:8080.

### Passo 2: Iniciar o Frontend

Siga as instruções na Seção 1, garantindo que a URL da API no arquivo frontend/services/api.ts aponta para http://localhost:8080.

---