// File: routes/authRouter.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Demo user store (replace with DB later)
const USERS = [
  { email: "admin@zochertfence.com", password: "fenceboss123" }
];

const SECRET = "super-secret-key"; // TODO: move to .env

// ✅ Login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "8h" });
  res.json({ success: true, token });
});

// ✅ Middleware to protect routes
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default router;
