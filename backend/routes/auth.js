import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  findUserById,
  createUser,
  toPublicUser,
} from "../utils/userStore.js";
import { signToken } from "../utils/token.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are all required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    if (findUserByEmail(email)) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({ username, email, passwordHash });
    const token = signToken({ id: user.id, username: user.username });

    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    return res.status(500).json({ message: "Could not create account." });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken({ id: user.id, username: user.username });
    return res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    return res.status(500).json({ message: "Could not sign in." });
  }
});

router.get("/me", requireAuth, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user: toPublicUser(user) });
});

export default router;
