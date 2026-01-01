const USERS_KEY = "travelmate_users";
const SESSION_KEY = "travelmate_session";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJSON(USERS_KEY, []);
}

export function getSession() {
  return readJSON(SESSION_KEY, null);
}

export function isAuthenticated() {
  return !!getSession();
}

export function signUp({ name, email, password }) {
  const users = getUsers();
  const safeEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === safeEmail)) {
    throw new Error("An account with this email already exists.");
  }

  // NOTE: demo-only password handling (no hashing)
  const newUser = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: name.trim(),
    email: safeEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  const next = [newUser, ...users];
  writeJSON(USERS_KEY, next);

  // Auto-login after signup
  const session = { id: newUser.id, name: newUser.name, email: newUser.email };
  writeJSON(SESSION_KEY, session);
  return session;
}

export function signIn({ email, password }) {
  const users = getUsers();
  const safeEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email === safeEmail);
  if (!user) throw new Error("No account found for this email.");
  if (user.password !== password) throw new Error("Incorrect password.");

  const session = { id: user.id, name: user.name, email: user.email };
  writeJSON(SESSION_KEY, session);
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUserId() {
  const session = getSession();
  return session?.id || null;
}
