import { verifyToken } from "../utils/token.js";

const DEFAULT_ROOMS = ["General", "Random", "Tech Talk"];

// roomName -> Map(socketId -> { id, username })
const roomMembers = new Map();
DEFAULT_ROOMS.forEach((room) => roomMembers.set(room, new Map()));

function getRoomUsers(room) {
  const members = roomMembers.get(room);
  return members ? Array.from(members.values()) : [];
}

export function initChatSocket(io) {
  // Authenticate every socket connection using the JWT issued at sign in.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required."));

    try {
      const decoded = verifyToken(token);
      socket.user = { id: decoded.id, username: decoded.username };
      next();
    } catch (err) {
      next(new Error("Invalid or expired token."));
    }
  });

  io.on("connection", (socket) => {
    socket.emit("rooms:list", DEFAULT_ROOMS);

    socket.on("room:join", (room) => {
      if (!DEFAULT_ROOMS.includes(room)) return;

      // Leave any previous room first.
      if (socket.currentRoom) {
        socket.leave(socket.currentRoom);
        roomMembers.get(socket.currentRoom)?.delete(socket.id);
        io.to(socket.currentRoom).emit(
          "room:users",
          getRoomUsers(socket.currentRoom)
        );
        socket.to(socket.currentRoom).emit("chat:system", {
          text: `${socket.user.username} left the room.`,
          timestamp: new Date().toISOString(),
        });
      }

      socket.join(room);
      socket.currentRoom = room;
      roomMembers.get(room).set(socket.id, socket.user);

      socket.emit("room:joined", room);
      io.to(room).emit("room:users", getRoomUsers(room));
      socket.to(room).emit("chat:system", {
        text: `${socket.user.username} joined the room.`,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("chat:message", (text) => {
      const room = socket.currentRoom;
      if (!room || typeof text !== "string" || !text.trim()) return;

      const message = {
        id: `${socket.id}-${Date.now()}`,
        text: text.trim().slice(0, 2000),
        username: socket.user.username,
        userId: socket.user.id,
        timestamp: new Date().toISOString(),
      };

      io.to(room).emit("chat:message", message);
    });

    socket.on("chat:typing", (isTyping) => {
      const room = socket.currentRoom;
      if (!room) return;
      socket.to(room).emit("chat:typing", {
        username: socket.user.username,
        isTyping: Boolean(isTyping),
      });
    });

    socket.on("disconnect", () => {
      const room = socket.currentRoom;
      if (!room) return;
      roomMembers.get(room)?.delete(socket.id);
      io.to(room).emit("room:users", getRoomUsers(room));
      socket.to(room).emit("chat:system", {
        text: `${socket.user.username} left the room.`,
        timestamp: new Date().toISOString(),
      });
    });
  });
}
