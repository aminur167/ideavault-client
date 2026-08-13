# IdeaVault — Startup Idea Sharing Platform

IdeaVault is a full-stack community platform where founders and learners can share startup concepts, discover emerging ideas, and refine them through constructive discussion.

**Live site:** https://ideavault-client-inky.vercel.app

## Features

- Public idea discovery with title search, category filters, date filters, sorting, and pagination.
- Firebase email/password and Google sign-in, with JWT-protected user actions.
- Add, update, delete, bookmark, and discuss startup ideas.
- Home page with a three-slide startup banner, six MongoDB-powered trending ideas, and community sections.
- Profile management with local device photo selection and Cloudinary image upload.
- Responsive dark/light interface, loading states, toast feedback, dynamic page titles, and a custom 404 page.

## Technology

- React, Vite, React Router, TanStack Query, Axios, Firebase, Cloudinary, Swiper, Lucide React.
- Node.js, Express, MongoDB Atlas, Mongoose, JWT, and Firebase Admin.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and provide the Firebase public configuration, Cloudinary values, and local API URL. Never commit `.env`.

## Deploy to Vercel

1. Import this repository in Vercel with framework preset **Vite**.
2. Add the following Vercel environment variables:

   - `VITE_API_URL=https://YOUR-SERVER.vercel.app/api`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

3. Deploy. The included `vercel.json` rewrites all paths to `index.html`, so reloading SPA routes such as `/profile` and `/ideas/:id` works.
4. In Firebase Authentication, add the deployed Vercel hostname under **Authorized domains**.

## Submission repositories

- Client: https://github.com/aminur167/ideavault-client
- Server: https://github.com/aminur167/ideavault-server
