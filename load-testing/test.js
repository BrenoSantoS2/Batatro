// load-testing/test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// --- Configuração do Teste ---
export const options = {
  // Define os estágios do nosso teste de carga.
  // Isso simula um aumento gradual de usuários.
  stages: [
    { duration: '10s', target: 100 }, // Aumenta para 20 usuários virtuais em 10 segundos
    { duration: '30s', target: 500 }, // Aumenta para 50 usuários virtuais nos próximos 30 segundos
    { duration: '10s', target: 0 },  // Diminui de volta para 0 usuários
  ],
  // Define os "thresholds" ou limites de aceitação.
  // Se alguma dessas condições falhar, o k6 encerrará o teste com um erro.
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% das requisições devem terminar em menos de 500ms
    'http_req_failed': ['rate<0.01'],    // A taxa de falha deve ser menor que 1%
  },
};

// --- O Código do Teste (O que cada usuário virtual faz) ---
export default function () {
  // O alvo do nosso teste é o endpoint de modificadores, passando pelo NGINX
  const res = http.get('http://localhost:8080/modificadores');

  // Verifica se a requisição foi bem-sucedida (status 200)
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Pequena pausa para simular um usuário real pensando antes de fazer a próxima ação
  sleep(1);
}