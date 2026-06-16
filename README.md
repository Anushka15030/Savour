# 🍽️ Savour — Food Recipe Website

A full-stack food recipe web application built with **Node.js**, **Express**, **MongoDB**, and **Vanilla JavaScript**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## Features

- 🔍 Real-time recipe search with category, difficulty, time & rating filters
- 🍛 8 cuisine categories — Indian, Italian, Vegan, Desserts, Chinese, Mexican, American, Mediterranean
- 👤 User authentication — signup / login via JWT
- ❤️ Save & manage favourite recipes per user
- ⭐ Community star ratings (1–5) + comment reviews
- ➕ Create new recipes with a live publish checklist
- 📱 Fully responsive — mobile, tablet & desktop

---

## Project Structure

```
savour/
├── public/
│   ├── index.html        # Home page
│   ├── recipes.html      # Browse & filter recipes
│   ├── recipe.html       # Recipe detail + reviews
│   ├── favorites.html    # Saved recipes
│   ├── create.html       # Add new recipe
│   ├── style.css
│   └── script.js
├── server/
│   ├── server.js
│   ├── models/           # User, Recipe (Mongoose schemas)
│   ├── controllers/      # Auth + Recipe logic
│   ├── routes/           # REST API routes
│   └── middleware/       # JWT auth guard
├── .env
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Edit .env and set your values:
MONGO_URI=mongodb://localhost:27017/recipedb
JWT_SECRET=your_secret_key_here
PORT=3000

# 3. Start the server
npm run dev        # development (nodemon)
npm start          # production

# 4. Seed sample data — open in browser:
http://localhost:3000/api/recipes/seed
```

### Open the app
```
http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/signup` | — | Register |
| `POST` | `/api/auth/login` | — | Login |
| `GET` | `/api/auth/me` | ✅ | Current user + favourites |
| `POST` | `/api/auth/favorites/:id` | ✅ | Toggle favourite |
| `GET` | `/api/recipes` | — | List recipes (filterable) |
| `GET` | `/api/recipes/featured` | — | Featured recipes |
| `GET` | `/api/recipes/:id` | — | Single recipe |
| `POST` | `/api/recipes` | ✅ | Create recipe |
| `PUT` | `/api/recipes/:id` | ✅ | Update recipe |
| `DELETE` | `/api/recipes/:id` | ✅ | Delete recipe |
| `POST` | `/api/recipes/:id/reviews` | ✅ | Add review |

**Filter params for `GET /api/recipes`:**
`search`, `category`, `difficulty`, `maxTime`, `minRating`, `sort`, `page`, `limit`

---

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/recipedb
JWT_SECRET=your_super_secret_key
PORT=3000
```

---

## License

MIT
