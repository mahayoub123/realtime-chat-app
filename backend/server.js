import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import { initChatSocket } from "./socket/chatSocket.js";

dotenv.config();

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// In production (single deployed service) frontend and backend share the
// same origin, so CLIENT_URL is only needed for local dev CORS.
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ["GET", "POST"] },
});

initChatSocket(io);

// Serve the built frontend as static files in production
if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  // Any route that isn't /api/* falls through to the SPA's index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});