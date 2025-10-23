# Shee Parlour — Frontend (Glassmorphism)

Soft White Glass UI + dark mode, search, add/edit/delete services (instant save to Render JSON Server).

## Live
- Frontend (GitHub Pages): https://sylviawahome.github.io/personal-website/
- Backend (Render): https://personal-website-del6.onrender.com/services

## Files (frontend)
- `index.html`
- `style.css`
- `index.js`
- `/images/` — add these images: `logo.jpg`, `herbal-facial.jpg`, `natural-hair-treatment.jpg`, `aloe-vera-massage.jpg`, `clay-mask-detox.jpg`, `floral-pedicure.jpg`, `leaf.png`

## Local testing (optional)
1. Frontend
   - Clone repo and open `index.html` in browser or run Live Server.

2. Backend (local)
   - Clone backend repo `shee-parlour-api`
   - `npm install`
   - `npm start`  (server.js uses process.env.PORT or 10000)
   - API endpoints:
     - GET  /services
     - POST /services
     - PATCH /services/:id
     - DELETE /services/:id

## Deploy
**Backend (Render)**:
1. Push `db.json`, `server.js`, `package.json` to backend GitHub repo.
2. Create a Render **Web Service** (Node).
   - Start command: `npm start`
3. After deploy, note Render URL and ensure `index.js` API_BASE_URL matches `https://personal-website-del6.onrender.com`

**Frontend (GitHub Pages)**:
1. Push `index.html`, `style.css`, `index.js`, `/images` to frontend GitHub repo (main branch).
2. In repo Settings → Pages → choose branch `main` & root folder.
3. Access site at `https://<your-username>.github.io/personal-website/`

## Notes
- Edits/adds/deletes are persisted to Render's JSON Server.
- If Render is down, frontend falls back to `db.json` (local) if present.
- To change glass look quickly, edit the token block at the top of `style.css`.
