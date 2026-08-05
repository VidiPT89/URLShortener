# 🚀 Guia de Setup - URLShortener

## ⚡ Quick Start (5 minutos)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env.local` na raiz do projeto e adicione uma destas opções:

#### Opção A: PostgreSQL Local (Docker recomendado)
```bash
# Instalar Docker e rodar:
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

Depois adicionar ao `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/urlshortener"
JWT_SECRET="seu-segredo-super-secreto-aqui-minimo-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-segredo-nextauth-aqui-minimo-32-caracteres"
```

#### Opção B: Supabase (nuvem grátis)
1. Ir para https://supabase.com
2. Criar conta e novo projeto
3. Copiar a connection string
4. Adicionar ao `.env.local`:
```env
DATABASE_URL="postgresql://[user]:[password]@[host]:5432/[database]"
JWT_SECRET="seu-segredo-super-secreto-aqui-minimo-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-segredo-nextauth-aqui-minimo-32-caracteres"
```

#### Opção C: Railway ou Neon
- Railway: https://railway.app
- Neon: https://neon.tech

### 3. Criar as tabelas no banco de dados

```bash
npx prisma migrate dev --name init
```

Isso vai:
- Criar as tabelas `User` e `ShortenedUrl`
- Inicializar o banco de dados

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 📋 O que vem pronto

✅ **Interface completa** com:
- Formulário para encurtar URLs
- Dashboard pessoal para usuários autenticados
- Sistema de login/cadastro

✅ **Backend com APIs**:
- POST `/api/urls` - Criar URL encurtada
- GET `/api/urls` - Listar URLs do usuário
- GET `/api/redirect/[code]` - Redirecionamento com contador de cliques
- POST `/api/auth/register` - Registrar usuário
- POST `/api/auth/login` - Fazer login
- POST `/api/auth/logout` - Fazer logout

✅ **Segurança**:
- Autenticação com JWT
- Senhas com hash bcrypt
- Validação de URLs e emails

✅ **Funcionalidades**:
- Códigos únicos gerados com nanoid
- Contador de cliques
- URLs pessoais para usuários autenticados
- UI responsiva com Tailwind CSS

## 🔧 Troubleshooting

### "DATABASE_URL is not set"
```bash
# Verifique se o arquivo .env.local existe e tem a variável DATABASE_URL
cat .env.local

# Se não existir:
# 1. Crie o arquivo .env.local
# 2. Adicione a DATABASE_URL
# 3. Rode: npm run dev
```

### "Erro ao conectar ao banco de dados"
```bash
# Verifique se o PostgreSQL está rodando
# Docker: docker ps (deve constar o container)
# Local: psql -U postgres (tenta se conectar)

# Teste a conexão:
npx prisma db execute --stdin < /dev/null
```

### "Cannot find module '@prisma/client'"
```bash
# Regenere o Prisma Client:
npx prisma generate

# Depois rode novamente:
npm run dev
```

## 📚 Scripts úteis

```bash
# Desenvolvimento
npm run dev                # Inicia servidor com hot reload

# Build e produção
npm run build              # Build para produção
npm start                  # Roda versão de produção

# Linting
npm run lint              # Verifica erros TypeScript/ESLint

# Prisma
npx prisma studio       # Abre interface visual do banco de dados
npx prisma migrate dev --name <name>  # Criar nova migration
npx prisma reset        # Reseta o banco de dados (CUIDADO!)
```

## 🌍 Deploy

### Vercel (recomendado)
```bash
npm i -g vercel
vercel
```

Siga as instruções. Vercel detectará que é um projeto Next.js e fará todo o setup automaticamente.

### Docker
```bash
# Build da imagem
docker build -t urlshortener .

# Rodar container
docker run -p 3000:3000 -e DATABASE_URL="..." urlshortener
```

## 🎨 Personalizar

### Trocar cores
Edit `app/page.tsx` e `app/components/Header.tsx`:
```tsx
className="bg-blue-600"  // Mudar para "bg-purple-600", "bg-red-600", etc
```

### Mudar tamanho do código curto
Edit `app/lib/utils.ts`:
```ts
export function generateShortCode(length: number = 6): string {  // Mude 6 para outro número
```

### Adicionar mais validações
Edit `app/lib/utils.ts` para adicionar suas próprias funções de validação

## 📝 Estrutura de arquivos

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
│   ├── generated/
│   │   └── prisma/ (gerado automaticamente)
│   ├── [code]/
│   │   └── page.tsx
│   └── page.tsx (página principal)
├── prisma/
│   ├── schema.prisma
│   └── migrations/ (criado após primeira migration)
├── .env.local (criar)
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Dicas

1. **URLs anônimas**: Usuários podem encurtar URLs sem fazer login
2. **URLs pessoais**: Login para acompanhar suas URLs e cliques
3. **Tokens JWT**: Válidos por 30 dias, armazenados no localStorage
4. **Banco de dados**: Totalmente configurável, use qualquer PostgreSQL

## 🆘 Precisa de ajuda?

1. Veja o README.md para documentação completa
2. Verifique os comentários no código
3. Teste as APIs com Postman ou curl:

```bash
# Criar URL
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://exemplo.com/pagina-longa"}'

# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

---

**Pronto para começar?** 🚀

```bash
npm run dev
```

Acesse http://localhost:3000 e comece a encurtar URLs!
