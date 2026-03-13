# 🃏 Flashcards App

Aplicativo web completo para criar e estudar flashcards com repetição espaçada (SRS) e geração de conteúdo por Inteligência Artificial.

🔗 **Frontend:** https://flashappcards.vercel.app  
🔗 **Backend:** https://flashcardsapi.vercel.app

---

## ✨ Funcionalidades

- **Criação manual de flashcards** com pergunta, resposta e tag para organização por decks
- **Geração por IA (Gemini):** crie um card individual ou um deck inteiro a partir de um tópico, com controle de nível de detalhe e tom da resposta
- **Modo visitante:** experimente a geração por IA sem precisar criar uma conta
- **Revisão com SRS (Repetição Espaçada):** sistema inspirado no Anki com os níveis Errado, Difícil e Correto — cada resposta ajusta automaticamente o intervalo até a próxima revisão do card
- **Gerenciamento de decks:** renomeie e exclua decks; edite e remova cards individuais
- **Autenticação completa:** registro, login e logout com JWT
- **Revisão geral ou por deck:** revise todos os cards com revisão pendente ou filtre por um deck específico

---

## 🛠️ Tecnologias

### Frontend
- React + TypeScript
- Vite
- React Router v6
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcrypt
- express-rate-limit

### Inteligência Artificial
- Gemini API (`@google/generative-ai`)

---

## 🗂️ Estrutura do Projeto

```
FlashcardsApp/
├── backend/            # Lógica do servidor
│   ├── api/            # Integração com Gemini
│   ├── config/         # Conexão com o banco de dados
│   ├── controllers/    # Lógica de cards e usuários
│   ├── middleware/     # Autenticação JWT e rate limiter
│   ├── models/         # Schemas Mongoose (Card, User)
│   └── routes/         # Rotas da API
├── frontend/           # Interface do usuário
│   └── src/
│       ├── components/ # Componentes reutilizáveis
│       ├── contexts/   # AuthContext
│       ├── pages/      # Páginas da aplicação
│       ├── router/     # React Router + rotas protegidas
│       ├── services/   # Camada de comunicação com a API
│       └── models/     # Interfaces TypeScript
├── server.js           # Entry point do backend
└── vercel.json         # Configuração de deploy
```

---

## 🔄 Como Funciona o SRS

Ao revisar um card, você avalia sua própria resposta em três níveis:

| Avaliação | Próxima revisão |
|-----------|----------------|
| ❌ Errado | ~10 minutos |
| 😅 Difícil | Intervalo reduzido |
| ✅ Correto | Intervalo aumentado progressivamente |

O algoritmo ajusta o `easeFactor` e o `interval` de cada card individualmente, garantindo que cards difíceis apareçam com mais frequência e cards dominados sejam revisados cada vez mais raramente.

---

## 🚀 Rodando Localmente

### Pré-requisitos
- Node.js 18+
- MongoDB

### Backend

```bash
# Na raiz do projeto
npm install

# Crie o arquivo .env com:
# DB_CONEXAO_STRING=sua_string_mongodb
# GEMINI_API_KEY=sua_chave_gemini
# JWT_SECRET_KEY=sua_chave_secreta

npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Crie o arquivo .env com:
# VITE_API_URL=http://localhost:3000

npm run dev
```

---

## 🔐 Variáveis de Ambiente

### Backend (`.env` na raiz)
| Variável | Descrição |
|----------|-----------|
| `DB_CONEXAO_STRING` | String de conexão com o MongoDB |
| `GEMINI_API_KEY` | Chave da API do Google Gemini |
| `JWT_SECRET_KEY` | Chave secreta para assinar os tokens JWT |

### Frontend (`frontend/.env`)
| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API do backend |

---

## 📡 Rotas da API

### Usuários
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/users/register` | Registrar novo usuário | ❌ |
| POST | `/users/login` | Fazer login | ❌ |

### Cards
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/cards` | Listar todos os cards | ✅ |
| GET | `/cards/review` | Listar cards com revisão pendente | ✅ |
| POST | `/cards` | Criar card manualmente | ✅ |
| POST | `/cards/generate` | Gerar card por IA | ✅ |
| POST | `/cards/generate-deck` | Gerar deck por IA | ✅ |
| PUT | `/cards/:id` | Editar card | ✅ |
| PUT | `/cards/:id/review` | Registrar revisão SRS | ✅ |
| PUT | `/cards/rename-deck` | Renomear deck | ✅ |
| DELETE | `/cards/:id` | Deletar card | ✅ |

### Visitante (sem autenticação)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users/guest/generate-text` | Gerar card por IA |
| POST | `/users/guest/generate-deck` | Gerar deck por IA |
