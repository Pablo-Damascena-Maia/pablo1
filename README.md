# Torre Verde - Sistema de Gestão de Estoque

Este projeto implementa um sistema completo de gestão de estoque para a Torre Verde, com interface de usuário moderna e funcionalidades essenciais para o controle de produtos, fornecedores e movimentações de estoque.

## Funcionalidades

- Cadastro e gerenciamento de produtos
- Controle de estoque com alertas de nível mínimo
- Gerenciamento de fornecedores
- Registro de movimentações de estoque (entradas, saídas e ajustes)
- Dashboard com visão geral do estoque e métricas importantes
- Interface responsiva para uso em dispositivos móveis e desktop

## Tecnologias Utilizadas

- React com TypeScript
- Tailwind CSS para estilização
- Supabase para backend e banco de dados
- React Router para navegação
- React Query para gerenciamento de estado e requisições
- Lucide React para ícones

## Configuração do Projeto

### Pré-requisitos

- Node.js versão 18 ou superior
- Conta no Supabase para configuração do banco de dados

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure o Supabase:
   - Crie um novo projeto no Supabase
   - Configure as tabelas conforme o esquema fornecido em `supabase/migrations`
   - Copie as credenciais de URL e chave anônima do seu projeto Supabase

4. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

5. Execute o projeto:

```bash
npm run dev
```

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `products`: Armazena informações dos produtos
- `inventory`: Controla os níveis de estoque dos produtos
- `suppliers`: Gerencia informações dos fornecedores
- `inventory_transactions`: Registra movimentações de estoque

## Desenvolvimento

Este projeto foi desenvolvido com foco em:

- Interface de usuário intuitiva e responsiva
- Experiência de usuário fluida com animações sutis
- Código modular e reutilizável
- Práticas modernas de React