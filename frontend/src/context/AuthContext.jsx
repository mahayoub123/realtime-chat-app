import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("chat_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("chat_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function saveSession({ token: newToken, user: newUser }) {
    localStorage.setItem("chat_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  async function signUp({ username, email, password }) {
    const { data } = await api.post("/auth/signup", {
      username,
      email,
      password,
    });
    saveSession(data);
    return data;
  }

  async function signIn({ email, password }) {
    const { data } = await api.post("/auth/signin", { email, password });
    saveSession(data);
    return data;
  }

  function signOut() {
    localStorage.removeItem("chat_token");
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
