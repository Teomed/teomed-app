# Teomed App

Um sistema moderno para gestão de aplicações médicas, construído com Next.js, TypeScript e Tailwind CSS no frontend, e NestJS com MongoDB no backend.

## Tecnologias Utilizadas

### Frontend
- Next.js 13+ com App Router
- TypeScript
- Tailwind CSS para estilização
- JWT para autenticação

### Backend
- NestJS
- MongoDB com Mongoose
- JWT para autenticação
- TypeScript

## Funcionalidades

- [x] Login com autenticação JWT
- [x] Dashboard responsivo
- [x] Listagem de aplicações
- [x] Status visual de aplicações (ativo/inativo)
- [ ] Criação de novas aplicações
- [ ] Edição de aplicações
- [ ] Exclusão de aplicações

## Como Executar

### Backend

1. Instale as dependências:
```bash
cd backend
npm install
```

2. Configure as variáveis de ambiente em `.env`:
```env
MONGODB_URI=sua_uri_mongodb
JWT_SECRET=seu_jwt_secret
```

3. Execute o script de seeding para criar as senhas iniciais:
```bash
npx ts-node src/seed.ts
```

4. Execute o servidor:
```bash
npm run start:dev
```

O servidor estará disponível em `http://localhost:3001`

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Estrutura do Projeto

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Login page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Root page (redirect)
│   └── globals.css         # Global styles
```

### Backend
```
backend/
├── src/
│   ├── auth/              # Autenticação
│   ├── applications/      # CRUD de aplicações
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Entry point
```

## Design

O projeto segue um design minimalista e moderno, com foco em:

- Paleta de cores profissional
  - Azul primário: #0066FF
  - Status ativo: #1C7A2C (verde)
  - Status inativo: #B25D05 (amarelo)
- Tipografia consistente usando a fonte Inter
- Layout responsivo
- Feedback visual para interações
- Transições suaves

## Segurança

- Todas as senhas são hasheadas usando bcrypt
- Autenticação via JWT
- Apenas 3 senhas autorizadas podem acessar o sistema
- Todas as rotas de API são protegidas
