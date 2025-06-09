# Projeto Balatro: Backend de Alta Performance

Este projeto consiste na implementação de uma API RESTful de alta performance inspirada no jogo [Balatro](https://www.playbalatro.com/), com foco em escalabilidade, disponibilidade e performance sob alta carga.

Além da API, o projeto inclui um cliente de frontend mobile (desenvolvido em uma fase anterior) e um conjunto de testes de carga para validar a robustez da arquitetura implementada.

## Arquitetura do Sistema

Para atender aos requisitos de alta concorrência e disponibilidade, foi projetada uma arquitetura de microsserviços distribuída e conteinerizada, orquestrada com Docker Compose.

### Diagrama de Blocos

O diagrama abaixo ilustra os componentes do sistema e como eles interagem:
[ Cliente (App Mobile / Teste de Carga k6) ]
|
v
[ Porta 8080 do Host ]
|
v
+--------------------------------+
| NGINX (Load Balancer) | <-- Ponto de Entrada Único
+--------------------------------+
| (Round-Robin)
+----------------+------------------+
| | |
v v v
[ API 1 ] [ API 2 ] ... [ API N ] <-- Escalabilidade Horizontal
(Fastify) (Fastify) (Fastify)
| | |
+----------------+------------------+
|
| <-----------> [ Redis (Cache) ]
| (Para leituras rápidas)
v
[ PostgreSQL (Banco de Dados) ]
(Fonte da Verdade / Persistência)


### Componentes da Arquitetura

*   **API (Node.js/Fastify):** O coração da aplicação. Implementada com Fastify por sua alta performance e baixa sobrecarga. Múltiplas instâncias rodam em paralelo para distribuir a carga.
*   **Load Balancer (NGINX):** Atua como um reverse proxy e ponto de entrada único para todo o sistema. Ele distribui as requisições recebidas entre as instâncias da API disponíveis, utilizando uma estratégia de balanceamento de carga (round-robin).
*   **Banco de Dados (PostgreSQL):** A fonte da verdade para os dados. Escolhido por sua robustez, confiabilidade e forte suporte a transações (ACID), garantindo a integridade dos dados.
*   **Cache (Redis):** Uma camada de cache em memória utilizada para armazenar dados frequentemente acessados (como a lista de modificadores). Isso alivia drasticamente a carga no banco de dados e reduz a latência das requisições de leitura.
*   **Orquestração (Docker & Docker Compose):** Toda a arquitetura é definida e gerenciada pelo Docker Compose, garantindo um ambiente de desenvolvimento e produção consistente, isolado e facilmente reprodutível.

## Respostas às Questões de Projeto

Esta seção detalha as escolhas de arquitetura e implementação para atender aos principais requisitos não-funcionais do sistema.

### O que você fez para garantir a Escalabilidade do sistema?

A escalabilidade horizontal é o pilar desta arquitetura. Ela foi alcançada através da execução de **múltiplas instâncias da API** em contêineres Docker, definidas pelo comando `--scale api=3` no `docker-compose.yml`. O **NGINX** atua como um load balancer, distribuindo as requisições entre as instâncias disponíveis. Para escalar o sistema e suportar mais carga, basta aumentar o número de réplicas da API, sem necessidade de downtime ou alterações no código.

### O que você fez para garantir a Disponibilidade do sistema?

A disponibilidade é garantida por dois mecanismos principais:
1.  **Redundância:** Ao rodar múltiplas instâncias da API, o sistema não possui um ponto único de falha no nível da aplicação.
2.  **Health Checks do Load Balancer:** O NGINX foi configurado com `max_fails=3` e `fail_timeout=30s`. Se uma instância da API falhar em responder, o NGINX para de rotear tráfego para ela e continua operando com as instâncias saudáveis, mantendo o serviço online. Adicionalmente, todos os serviços no Docker Compose estão configurados com `restart: always`, para que o Docker tente recuperá-los automaticamente em caso de falha.

### O que você fez para garantir a Performance do sistema?

A performance sob alta carga foi o foco central, abordada com as seguintes estratégias:
1.  **Framework de Alta Performance:** A escolha do **Fastify** em vez de frameworks mais tradicionais (como Express) foi deliberada, visando seu alto throughput e baixa latência.
2.  **Cache em Memória com Redis:** A implementação de uma camada de cache para a rota `GET /modificadores` é a otimização mais impactante. Requisições subsequentes a esta rota são servidas diretamente da memória pelo Redis, sendo ordens de magnitude mais rápidas do que um acesso ao banco de dados.

**Resultados do Teste de Carga (k6):**

Os testes de carga comprovam a eficácia do cache. Simulando 50 usuários virtuais por 30 segundos, obtivemos os seguintes resultados:

*   **Sem Cache Redis:**
    *   Requisições por segundo: `[SEU RESULTADO SEM CACHE, ex: ~250 req/s]`
    *   Tempo médio de resposta: `[SEU RESULTADO SEM CACHE, ex: ~150ms]`
*   **Com Cache Redis Habilitado:**
    *   Requisições por segundo: `[SEU RESULTADO COM CACHE, ex: ~3000 req/s]`
    *   Tempo médio de resposta: `[SEU RESULTADO COM CACHE, ex: ~12ms]`

*(**Instrução:** Substitua os valores acima pelos resultados reais obtidos no seu teste k6. Se quiser, pode colocar prints dos resultados aqui também).*

### O que você fez para garantir a Integridade dos Dados?

A integridade dos dados é assegurada pelo **PostgreSQL** e pelo **Prisma ORM**:
1.  **Transações ACID:** O PostgreSQL garante que as operações no banco ou são completadas com sucesso ou são totalmente revertidas, evitando estados de dados inconsistentes.
2.  **Schema Definido:** O `schema.prisma` define um contrato rigoroso para os dados, com tipos de dados corretos (ex: `Int[]` para `modificadores_equipados`), campos obrigatórios e constraints. O Prisma garante que apenas dados que respeitem esse schema possam ser inseridos ou atualizados.

### O que você fez para garantir a Segurança do sistema?

A segurança foi abordada em múltiplas camadas:
1.  **Gerenciamento de Segredos:** As credenciais do banco de dados não estão expostas no código. Elas são gerenciadas através de variáveis de ambiente no `docker-compose.yml`, que são injetadas nos contêineres em tempo de execução.
2.  **Rede Privada:** Todos os serviços (API, DB, Cache) se comunicam através de uma rede Docker privada (`balatro-net`). Apenas o Load Balancer (NGINX) tem uma porta exposta ao mundo exterior, protegendo o banco de dados e o cache de acessos diretos.
3.  **Princípio do Menor Privilégio:** Cada contêiner só tem acesso ao que é estritamente necessário para sua função.

### O que você fez para garantir a Manutenibilidade e Testabilidade do sistema?

*   **Manutenibilidade:** O uso de **TypeScript** em todo o backend impõe tipagem forte, tornando o código auto-documentado e mais fácil de refatorar com segurança. A arquitetura desacoplada em serviços e o uso do Docker garantem que cada parte possa ser mantida e atualizada de forma independente.
*   **Testabilidade:** O sistema foi projetado para ser testável em vários níveis. A API pode ter testes unitários e de integração. A robustez da arquitetura completa é validada através dos **testes de carga com k6**, cujo script (`load-testing/test.js`) está incluído neste repositório, garantindo que futuras alterações não degradem a performance.

## Como Executar o Projeto

### Pré-requisitos

-   Docker e Docker Compose instalados.
-   k6 instalado (para testes de carga).

### Instruções

1.  Clone este repositório.
2.  Navegue até a pasta `backend`.
3.  Execute o seguinte comando para construir as imagens e iniciar todos os serviços em modo de produção, com 3 réplicas da API:
    ```bash
    docker-compose up --build --scale api=3
    ```
4.  O sistema estará acessível através do Load Balancer na porta `8080` do seu host.
    *   **Endpoint de Modificadores:** `http://localhost:8080/modificadores`
    *   **Endpoint do Jogador:** `http://localhost:8080/jogador`

### Executando os Testes de Carga

1.  Com o sistema rodando, abra um novo terminal.
2.  Navegue até a pasta `load-testing`.
3.  Execute o k6:
    ```bash
    k6 run test.js
    ```