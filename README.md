# 💚 Shee Parlour – Nature-Inspired Beauty Website

Welcome to **Shee Parlour**, a nature-inspired single-page website created as the final individual capstone project for **SDF-FT14B**. It blends tranquility, sustainable self-care, and elegant web interactivity.

---

## 🌸 Project Overview
The site showcases five spa & salon services, complete with images, prices, and durations. Users can:

* Toggle dark / light themes  
* Search services live  
* Edit or delete any service card (changes held in-browser)  
* Enjoy a calming falling-leaf animation – pure CSS + JS  
* Browse – no page reloads (true SPA)

---

## 📌 Key Features
| Feature | Details |
|---------|---------|
| **SPA** | One `index.html`, section links only |
| Dark Mode | Click once to swap themes |
| Live Search | `input` event filters service names |
| Edit / Delete | Inline editing via `contenteditable`; delete removes card (UI only) |
| Responsive | Flexbox + mobile-friendly layout |
| Animated Leaves | CSS `@keyframes` + JavaScript seed |

---

## 🖼 Services
1. Herbal Facial – Ksh 1500, 45 mins  
2. Natural Hair Treatment – Ksh 2000, 1 hour  
3. Aloe Vera Massage – Ksh 1800, 30 mins  
4. Clay Mask Detox – Ksh 1700, 40 mins  
5. Floral Pedicure – Ksh 1300, 35 mins  

Service images live in `/images/` and are also referenced by absolute URLs for the API.

---

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | **HTML 5, CSS 3, JavaScript (ES6)** |
| Backend API | **JSON Server** deployed on **Render** |
| Hosting | GitHub Pages (frontend) + Render (backend) |

---

## 🔗 Live Demo
* **Frontend (GitHub Pages)**  
  <https://sylviawahome.github.io/personal-website/>

* **Backend API (Render)**  
  <https://shee-parlour-api.onrender.com/services>

---

## 🚀 Running Locally

### 1 Clone the frontend
```bash
git clone https://github.com/SylviaWahome/personal-website.git
cd personal-website
