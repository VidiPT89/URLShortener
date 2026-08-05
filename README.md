# 🔗 URLShortener

Um encurtador de URLs moderno e eficiente, feito com **Next.js** + **PostgreSQL** + **nanoid**.

## ✨ Funcionalidades

- ✅ **Gera código curto único** usando nanoid (6 caracteres por padrão)
- ✅ **Redirecionamento via API** com redirecionamento HTTP 301
- ✅ **Contador de cliques** para cada URL encurtada
- ✅ **Autenticação opcional** com JWT para gerenciar suas URLs
- ✅ **Dashboard pessoal** para ver todas as suas URLs
- ✅ **UI responsiva** com Tailwind CSS

## 🛠️ Stack

- **Frontend**: Next.js 16+ com React + TypeScript + Tailwind CSS
- **Backend**: API routes do Next.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT + bcrypt
- **Utilitários**: nanoid para gerar IDs únicos

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 12+ (local ou em nuvem)

## 🚀 Setup

### 1. Clonar e instalar dependências

```bash
cd urlshortener
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database URL (escolha uma opção):
# Local: postgresql://user:password@localhost:5432/urlshortener
# Supabase: postgresql://[user]:[password]@[host]:5432/[database]
# Railway: postgresql://...
DATABASE_URL="postgresql://user:password@localhost:5432/urlshortener"

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET="seu-segredo-super-secreto-aqui-minimo-32-caracteres"

# NextAuth (opcional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-segredo-nextauth-aqui-minimo-32-caracteres"
```

### 3. Executar migrations

```bash
npx prisma migrate dev --name init
```

Isso vai:
- Criar as tabelas no banco de dados
- Gerar o Prisma Client

### 4. Iniciar o servidor

```bash
npm run dev
```

Acesse http://localhost:3000

## 📖 Como Usar

### Sem autenticação (anônimo)

1. Vá para a página inicial
2. Cole sua URL longa
3. Clique em "Encurtar URL 🔗"
4. Copie a URL curta gerada

**Nota**: URLs criadas sem autenticação não serão listadas.

### Com autenticação

1. Clique em "Entrar / Cadastrar"
2. Faça o registro com seu email e senha
3. Agora todas as URLs que criar serão associadas à sua conta
4. Acesse o dashboard para ver:
   - Todas as suas URLs encurtadas
   - Número de cliques em cada link
   - Data de criação

## 🔌 API Endpoints

### POST `/api/urls`
Cria uma nova URL encurtada.

**Headers** (opcional):
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "originalUrl": "https://exemplo.com/pagina-muito-longa"
}
```

**Response (201)**:
```json
{
  "id": "abc123",
  "code": "xyz789",
  "originalUrl": "https://exemplo.com/pagina-muito-longa",
  "shortUrl": "http://localhost:3000/xyz789",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### GET `/api/urls`
Lista todas as URLs encurtadas do usuário autenticado.

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200)**:
```json
{
  "urls": [
    {
      "id": "abc123",
      "code": "xyz789",
      "originalUrl": "https://exemplo.com/pagina-muito-longa",
      "clicks": 42,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET `/api/redirect/[code]`
Redireciona para a URL original e incrementa o contador de cliques.

**Response (301)**: Redirect para a URL original

### POST `/api/auth/register`
Registra um novo usuário.

**Body**:
```json
{
  "email": "seu@email.com",
  "password": "senha123"
}
```

**Response (201)**:
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "seu@email.com"
  }
}
```

### POST `/api/auth/login`
Faz login de um usuário.

**Body**:
```json
{
  "email": "seu@email.com",
  "password": "senha123"
}
```

**Response (200)**:
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "seu@email.com"
  }
}
```

### POST `/api/auth/logout`
Faz logout (apenas para confirmação, remova o token no cliente).

**Response (200)**:
```json
{
  "message": "Logout realizado com sucesso"
}
```

## 📊 Schema do Banco de Dados

### Tabela `User`
```
- id: String (PK)
- email: String (UNIQUE)
- password: String (hashed)
- createdAt: DateTime
- updatedAt: DateTime
```

### Tabela `ShortenedUrl`
```
- id: String (PK)
- code: String (UNIQUE, indexed)
- originalUrl: String
- clicks: Int (default: 0)
- userId: String (FK, optional)
- createdAt: DateTime
- updatedAt: DateTime
```

## 🔐 Segurança

- Senhas são armazenadas com hash bcrypt (10 rounds)
- Tokens JWT com expiração de 30 dias
- Validação de email e URL
- CORS habilitado apenas para origens confiáveis (configurar em produção)

## 📦 Estrutura do Projeto

```
urlshortener/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── logout/route.ts
│   │   ├── urls/route.ts
│   │   └── redirect/[code]/route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ShortenerForm.tsx
│   │   ├── UrlList.tsx
│   │   └── AuthForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── [code]/
│   │   └── page.tsx
│   └── page.tsx
├── prisma/
│   └── schema.prisma
├── .env.local
├── package.json
└── README.md
```

## 🚀 Deploy

### Vercel (recomendado)

```bash
npm i -g vercel
vercel
```

### Docker

Crie um `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🛠️ Desenvolvimento

### Scripts disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Inicia servidor de produção
npm run lint     # Verifica erros com ESLint
```

### Executar migrations

```bash
npx prisma migrate dev      # Criar nova migration
npx prisma migrate deploy   # Aplicar migrations em produção
npx prisma studio          # Interface visual do Prisma
```

## 📝 Changelog

### v1.0 (2024-01-15)
- ✅ MVP completo
- ✅ Autenticação com JWT
- ✅ Dashboard de URLs
- ✅ Contador de cliques
- ✅ UI responsiva

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou um pull request.

## 📞 Suporte

Encontrou um bug? Abra uma [issue](https://github.com/VidiPT89/URLShortener/issues).
