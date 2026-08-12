# IdeaVault – Startup Idea Sharing Platform 💡🚀

IdeaVault is a web-based platform where users can share innovative startup ideas, explore ideas posted by others, and engage through comments and community discussions.

**Live Site URL**: [https://ideavault-app.vercel.app](https://ideavault-app.vercel.app)

---

## 🌟 Key Features

- **Startup Idea Exploration & Sharing**: Users can post detailed startup ideas with category tags, problem statements, proposed solutions, target audience, and estimated budget.
- **Interactive Comment & Discussion System**: Engaged community members can comment on ideas, edit or delete their own comments in real-time with automatic comment counting.
- **Search & Advanced Filtering**: Case-insensitive search by idea title using MongoDB `$regex`, filter by categories (Tech, AI, Health, Education, Finance, etc.), and filter by date range.
- **Authentication & Security**: Complete Firebase integration supporting Email/Password and Google OAuth login with custom server-side JWT authentication and protected routes.
- **Dark / Light Theme Toggle**: Seamless global theme toggle saved to local storage with glassmorphism design, vibrant gradients, and smooth micro-animations.

---

## 🛠️ Technology Stack

- **Client**: React 18, Vite, React Router v6, Axios, TanStack React Query, Framer Motion, Swiper.js, Lucide Icons, React Hot Toast
- **Server**: Node.js, Express.js, MongoDB Atlas, Mongoose, JSON Web Tokens (JWT), CORS
- **Hosting**: Vercel (Client SPA) & Render / Vercel (Server API)

---

## 🚀 Getting Started Locally

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm run dev
```
