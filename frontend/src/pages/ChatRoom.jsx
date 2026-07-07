import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";
import { SOCKET_URL } from "../api/axios.js";

export default function ChatRoom() {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set up the socket connection once.
  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("rooms:list", (roomList) => {
      setRooms(roomList);
      if (roomList.length > 0) {
        socket.emit("room:join", roomList[0]);
      }
    });

    socket.on("room:joined", (room) => {
      setActiveRoom(room);
      setMessages([]);
    });

    socket.on("room:users", (users) => setOnlineUsers(users));

    socket.on("chat:message", (message) => {
      setMessages((prev) => [...prev, { type: "message", ...message }]);
    });

    socket.on("chat:system", (event) => {
      setMessages((prev) => [
        ...prev,
        { type: "system", id: `sys-${Date.now()}-${Math.random()}`, ...event },
      ]);
    });

    socket.on("chat:typing", ({ username, isTyping }) => {
      setTypingUser(isTyping ? username : null);
      if (isTyping) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2500);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function switchRoom(room) {
    if (room === activeRoom) return;
    socketRef.current?.emit("room:join", room);
    setSidebarOpen(false);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !socketRef.current) return;
    socketRef.current.emit("chat:message", draft);
    socketRef.current.emit("chat:typing", false);
    setDraft("");
  }

  function handleDraftChange(e) {
    setDraft(e.target.value);
    socketRef.current?.emit("chat:typing", true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("chat:typing", false);
    }, 1200);
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl flex-col px-0 sm:px-6 sm:py-6">
      <div className="card flex flex-1 overflow-hidden sm:rounded-2xl">
        {/* Rooms + presence sidebar */}
        <aside
          className={`absolute inset-y-0 left-0 z-20 w-64 shrink-0 border-r border-white/10 bg-ink-light transition-transform sm:static sm:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-mist-dim">
              Rooms
            </span>
            <span
              className={`flex items-center gap-1.5 text-xs ${
                connected ? "text-signal" : "text-flare"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {connected ? "Connected" : "Offline"}
            </span>
          </div>
          <ul className="space-y-1 p-3">
            {rooms.map((room) => (
              <li key={room}>
                <button
                  onClick={() => switchRoom(room)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    room === activeRoom
                      ? "bg-signal/15 text-signal"
                      : "text-mist-dim hover:bg-white/5 hover:text-mist"
                  }`}
                >
                  # {room}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 p-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-mist-dim">
              Online ({onlineUsers.length})
            </span>
            <ul className="mt-3 space-y-2">
              {onlineUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-2 text-sm text-mist">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-signal" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                  </span>
                  {u.username}
                  {u.id === user?.id && (
                    <span className="text-xs text-mist-dim">(you)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/50 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main chat panel */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 p-4">
            <button
              className="rounded-lg border border-white/10 p-1.5 text-mist sm:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open rooms"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-base font-semibold text-mist">
                {activeRoom ? `# ${activeRoom}` : "Loading room..."}
              </h1>
              <p className="text-xs text-mist-dim">
                {onlineUsers.length} {onlineUsers.length === 1 ? "person" : "people"} here
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) =>
              m.type === "system" ? (
                <p key={m.id} className="text-center text-xs italic text-mist-dim">
                  {m.text}
                </p>
              ) : (
                <div
                  key={m.id}
                  className={`flex ${m.userId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm sm:max-w-[65%] ${
                      m.userId === user?.id
                        ? "bg-signal text-ink"
                        : "bg-white/5 text-mist"
                    }`}
                  >
                    {m.userId !== user?.id && (
                      <p className="mb-0.5 text-xs font-semibold text-signal">
                        {m.username}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        m.userId === user?.id ? "text-ink/60" : "text-mist-dim"
                      }`}
                    >
                      {formatTime(m.timestamp)}
                    </p>
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            {typingUser && (
              <p className="mb-2 text-xs italic text-mist-dim">
                {typingUser} is typing...
              </p>
            )}
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <input
                type="text"
                value={draft}
                onChange={handleDraftChange}
                placeholder="Write a message..."
                className="input-field"
                autoComplete="off"
              />
              <button type="submit" className="btn-primary shrink-0" disabled={!draft.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
