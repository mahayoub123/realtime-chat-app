// Simple in-memory user store.
// Swap this out for a real database (MongoDB, Postgres, etc.) in production.

const users = [];
let nextId = 1;

export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return users.find((u) => u.id === id);
}

export function createUser({ username, email, passwordHash }) {
  const user = {
    id: nextId++,
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

export default users;
