# Shee Parlour — Frontend (One-page HTML/CSS/JS)

Soft White Glass UI + dark mode, falling leaves, live services fetched from Render JSON Server.

## Live (example)
- Backend (Render): https://personal-website-1-l6g4.onrender.com/services

## Files
- `index.html`
- `style.css`
- `index.js`
- `db.json` (seed / fallback)
- `/images/` — put image files here:
  - `logo.jpg`
  - `hero-nature.jpg`
  - `herbal-facial.jpg`
  - `natural-hair-treatment.jpg`
  - `aloe-vera-massage.jpg`
  - `clay-mask-detox.jpg`
  - `floral-pedicure.jpg`
  - `leaf.png`

## How it works
- Frontend fetches services from `https://personal-website-1-l6g4.onrender.com/services`.
- If API fails, it falls back to `db.json` (local).
- Add / Edit / Delete attempts to persist to the API (json-server). If your API is running on Render with json-server, changes will persist.
- Booking form stores requests locally (localStorage) as demo.

## Deploy to GitHub Pages
1. Put files in the repo root (frontend repo `personal-website`).
2. Push to GitHub:
   ```bash
   git add index.html style.css index.js db.json images/ README.md
   git commit -m "Shee Parlour final frontend"
   git push origin main
