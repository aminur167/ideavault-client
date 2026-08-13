# IdeaVault — Startup Idea Sharing Platform

IdeaVault is a full-stack community platform where builders share startup ideas, gather feedback, and refine concepts through structured discussion.

**Live site:** Add the deployed Vercel client URL here after deployment.

## Features

- Secure Firebase email/password and Google authentication with protected user areas.
- Create, update, browse, search, filter, bookmark, and discuss startup ideas.
- Trending ideas powered by MongoDB aggregation and community comment activity.
- Personal workspace for profile management, submitted ideas, comments, and bookmarks.
- Responsive dark/light interface with route-based titles, loading states, toast feedback, and a custom 404 page.
- Profile-photo picker with Cloudinary image hosting, avoiding manual image URL entry.

## Technology

- React, Vite, React Router, TanStack Query, Axios, Firebase, Cloudinary, Swiper, and Lucide.
- Node.js, Express, MongoDB Atlas, Mongoose, JWT, and Firebase Admin verification.

## Run locally

```bash
npm install
npm run dev
```

Create a `.env` file from `.env.example` and set the Firebase, Cloudinary, and API variables before starting.

## Deployment

Deploy the client to Vercel. The included `vercel.json` rewrites all routes to the SPA entry point, so refreshing a page such as `/profile` or `/ideas/:id` works correctly.
"# ideavault-client" 
