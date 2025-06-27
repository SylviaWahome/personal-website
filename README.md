# 💚 Shee Parlour – Nature-Inspired Beauty Website

A single-page spa website with a live JSON-Server backend.

| Live Frontend | Live Backend (API) |
|---------------|-------------------|
| https://sylviawahome.github.io/personal-website/ | https://shee-parlour-api.onrender.com/services |

## ✨ Features
- SPA (no reloads) with smooth in-page navigation
- Dark-mode toggle
- Falling-leaf ambience animation
- Live search filter
- Inline edit & delete (in-memory)
- Responsive layout

## 🛠 Tech
| Layer | Stack |
|-------|-------|
| Frontend | HTML 5, CSS 3, Vanilla JS (ES6) |
| Backend  | JSON Server on Render |
| Hosting  | GitHub Pages + Render |

## 🚀 Local Setup
```bash
# Frontend
git clone https://github.com/SylviaWahome/personal-website
cd personal-website
open index.html   # or use Live Server

# Backend (optional local run)
git clone https://github.com/<your-username>/shee-parlour-api
cd shee-parlour-api
npm install
npm start        # http://localhost:10000/services
