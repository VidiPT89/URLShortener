# 🔗 URLShortener

> Modern URL shortener with unique short codes, click analytics, optional authentication and bilingual support — built with Next.js, PostgreSQL and Prisma

**[Live Demo](https://urlshortener-vidi.vercel.app)** · **[Report Bug](https://github.com/VidiPT89/URLShortener/issues)** · **[Request Feature](https://github.com/VidiPT89/URLShortener/issues)**

---

## ✨ Features

- ✅ **Unique Short Codes** — Auto-generated 6-character codes with nanoid
- ✅ **Click Analytics** — Track how many times each link is clicked
- ✅ **Optional Authentication** — JWT-based login to manage and organize your URLs
- ✅ **Bilingual Support** — Portuguese (PT) and English (EN) with language toggle
- ✅ **Modern UI** — Glassmorphism design with smooth animations (Framer Motion)
- ✅ **Fast Redirects** — HTTP 301 redirects with automatic click counting
- ✅ **Responsive Design** — Mobile-first approach using Tailwind CSS
- ✅ **Splash Screen** — Beautiful animated intro with creator credits

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT (jsonwebtoken) + bcrypt |
| **Deployment** | Vercel, Railway, Docker |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (or Supabase, Railway, Neon)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/VidiPT89/URLShortener.git
cd URLShortener
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/urlshortener"

# JWT
JWT_SECRET="your-secret-key-minimum-32-characters-long"

# Optional: NextAuth (for future enhancement)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-minimum-32-characters"
```

**Database URL options:**
- **Local PostgreSQL**: `postgresql://postgres:password@localhost:5432/urlshortener`
- **Supabase**: `postgresql://[user]:[password]@[host]:5432/[database]`
- **Railway**: Get from Railway dashboard
- **Neon**: Get from Neon dashboard

4. **Initialize the database**
```bash
npx prisma migrate dev --name init
```

This creates the `User` and `ShortenedUrl` tables.

5. **Start the development server**
```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)**

---

## 📖 Usage

### Anonymous Usage
1. Paste your long URL in the input field
2. Click "Shorten URL"
3. Copy your shortened URL
4. Share it anywhere!

### With Authentication
1. Click "Sign In / Sign Up" in the header
2. Create an account or login
3. All your shortened URLs are saved to your account
4. Track clicks and view analytics in your dashboard
5. Manage your URLs anytime from your account

### Language Toggle
- Click the language selector (🇵🇹 / 🇬🇧) in the header
- Switch between Portuguese and English
- Your preference is saved to localStorage

---

## 🔌 API Endpoints

### Public Endpoints

**POST** `/api/urls`  
Create a shortened URL (anonymous or authenticated)

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very-long-url"}'
```

Response:
```json
{
  "id": "abc123",
  "code": "xyz789",
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/xyz789",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

**GET** `/api/redirect/[code]`  
Redirect to original URL and increment click counter

```bash
curl http://localhost:3000/api/redirect/xyz789
# Returns: HTTP 301 redirect to original URL
```

---

### Authenticated Endpoints

**GET** `/api/urls`  
List all URLs for the authenticated user

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/urls
```

Response:
```json
{
  "urls": [
    {
      "id": "abc123",
      "code": "xyz789",
      "originalUrl": "https://example.com/very-long-url",
      "clicks": 42,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

---

### Authentication Endpoints

**POST** `/api/auth/register`  
Create a new user account

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

**POST** `/api/auth/login`  
Login to an existing account

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

**POST** `/api/auth/logout`  
Logout (token removal handled client-side)

---

## 📊 Database Schema

### User Table
```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String    // bcrypt hashed
  urls      ShortenedUrl[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### ShortenedUrl Table
```prisma
model ShortenedUrl {
  id          String    @id @default(cuid())
  code        String    @unique @db.VarChar(10)
  originalUrl String
  clicks      Int       @default(0)
  userId      String?   // Optional: NULL for anonymous URLs
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([code])
  @@index([userId])
}
```

---

## 🔐 Security

- **Passwords** — Hashed with bcrypt (10 rounds)
- **Tokens** — JWT with 30-day expiration
- **Validation** — Email and URL validation on all inputs
- **CORS** — Configured for secure cross-origin requests
- **Database** — Prisma parameterized queries prevent SQL injection

---

## 📦 Project Structure

```
URLShortener/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── urls/route.ts
│   │   └── redirect/[code]/route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ShortenerForm.tsx
│   │   ├── AuthForm.tsx
│   │   ├── UrlList.tsx
│   │   ├── SplashScreen.tsx
│   │   └── LanguageSelector.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useLanguage.ts
│   ├── i18n/
│   │   ├── pt.ts
│   │   ├── en.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── generated/
│   │   └── prisma/ (auto-generated)
│   ├── [code]/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.local (create this)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npm run type-check

# Format code with Prettier
npm run format

# Lint with ESLint
npm run lint
```

### Prisma Commands

```bash
# Open Prisma Studio (visual database editor)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ removes all data)
npx prisma migrate reset
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Vercel automatically detects Next.js and handles deployment. Just link your PostgreSQL database.

### Railway

1. Create a Railway project
2. Add PostgreSQL database
3. Add your repository
4. Set environment variables
5. Deploy

### Docker

```bash
# Build
docker build -t urlshortener .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  urlshortener
```

---

## 🌐 Environment Configuration

### Development
```bash
npm run dev  # Runs on http://localhost:3000
```

### Production
Set these environment variables on your hosting platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

---

## 📝 Internationalization (i18n)

The app supports Portuguese (PT) and English (EN). Add new languages by:

1. Create a translation file in `/app/i18n/`:
```typescript
// app/i18n/es.ts
export const es = {
  app: { /* ... */ },
  // ...
};
```

2. Update `/app/i18n/index.ts`:
```typescript
export const translations = {
  pt,
  en,
  es,  // Add here
};
```

3. Update `Locale` type:
```typescript
export type Locale = 'pt' | 'en' | 'es';
```

---

## 🎨 Customization

### Change Colors
Edit the gradient colors in components. Default theme uses:
- **Orange**: `#FF6B35` / `from-orange-400 to-orange-500`
- **Yellow**: `#F7931E` / `from-yellow-500 to-yellow-600`
- **Black**: `#0F0F0F` / `from-black to-gray-900`

Update Tailwind classes like:
```tsx
className="from-orange-400 to-yellow-500"
// Change to your preferred colors
```

### Change Short Code Length
Edit `/app/lib/utils.ts`:
```typescript
export function generateShortCode(length: number = 6): string {  // Change 6
  return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', length)();
}
```

### Modify Animations
Edit component files and adjust Framer Motion properties:
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}
```

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**David Arsénio Martins** (Vidi)

- 🌐 Website: [ividi.dev](https://ividi.dev)
- 🐙 GitHub: [@VidiPT89](https://github.com/VidiPT89)
- 💼 LinkedIn: [david-martins-9b0129270](https://www.linkedin.com/in/david-martins-9b0129270/)
- 📧 Email: [ividi.dev@gmail.com](mailto:ividi.dev@gmail.com)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

Found a bug or have a suggestion? 

- **Report Bug**: [GitHub Issues](https://github.com/VidiPT89/URLShortener/issues)
- **Request Feature**: [GitHub Issues](https://github.com/VidiPT89/URLShortener/issues)
- **Email**: [ividi.dev@gmail.com](mailto:ividi.dev@gmail.com)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)

---

<div align="center">

Made with ❤️ by [David Arsénio Martins](https://ividi.dev)

⭐ If you found this useful, please consider giving it a star!

</div>
