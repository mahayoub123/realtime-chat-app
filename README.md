# Wavelength — Real-Time Chat App

A full-stack real-time chat application:

- **Frontend:** React + React Router + Tailwind CSS + Socket.IO client (Vite)
- **Backend:** Node.js + Express + Socket.IO server + JWT authentication

Pages: **Sign in**, **Sign up**, **Home**, **About**, **Contact**, **Chat Room**, plus a shared **Navbar** and **Footer**. Fully responsive (mobile, tablet, desktop).

## Project structure

```
realtime-chat-app/
├── backend/
│   ├── middleware/auth.js       # JWT verification middleware
│   ├── routes/auth.js           # /api/auth/signup, /signin, /me
│   ├── socket/chatSocket.js     # Socket.IO real-time chat logic (rooms, presence, typing)
│   ├── utils/                   # token + in-memory user store helpers
│   ├── server.js                # Express + Socket.IO entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/          # Navbar, Footer, ProtectedRoute
    │   ├── context/AuthContext.jsx
    │   ├── pages/                # Home, About, Contact, SignIn, SignUp, ChatRoom, NotFound
    │   ├── api/axios.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
npm run dev      # starts on http://localhost:5000 (uses nodemon)
# or: npm start
```

Notes:
- Users are stored **in memory** for simplicity (they reset when the server restarts). Swap `backend/utils/userStore.js` for a real database (MongoDB, PostgreSQL, etc.) for production use.
- Passwords are hashed with bcrypt; sessions use signed JWTs (7 day expiry).

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your backend runs on a different URL
npm run dev       # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Make sure the backend is running first, since sign in/up and the chat room both depend on it.

## How it works

1. **Sign up / Sign in** — `POST /api/auth/signup` and `/api/auth/signin` hash/verify the password and return a JWT, stored in `localStorage`.
2. **Chat Room** — on entering `/chat`, the frontend opens a Socket.IO connection, authenticating the handshake with the JWT. The server verifies the token before allowing the connection.
3. **Rooms** — three demo rooms are seeded on the server (`General`, `Random`, `Tech Talk`). Joining a room subscribes the socket to that room's broadcast channel.
4. **Real-time events** — `chat:message` broadcasts new messages to everyone in the room, `chat:typing` shows a live typing indicator, and `room:users` keeps the online-presence list in sync.
5. **Protected routes** — `/chat` is wrapped in `ProtectedRoute`, redirecting unauthenticated users to `/signin`.

## Building for production

```bash
cd frontend
npm run build     # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (Express `express.static`, Nginx, Vercel, Netlify, etc.), and deploy `backend/` to a Node host (Render, Railway, Fly.io, a VPS...). Remember to update `CLIENT_URL` in the backend `.env` and `VITE_API_URL` in the frontend `.env` to your deployed URLs.
