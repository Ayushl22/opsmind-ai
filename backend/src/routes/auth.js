import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * Helper — create a signed JWT for a user.
 */
const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Helper — shape the user object returned to the frontend.
 */
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  picture: user.picture || null,
  authProviders: user.authProviders,
  lastLoginAt: user.lastLoginAt,
});

// ── POST /api/auth/signup ───────────────────────────────────────────
router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      authProviders: ["manual"],
      lastLoginAt: new Date(),
    });

    const token = signToken(user);
    console.log(`[auth] Signup: ${user.email}`);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("[auth] Signup error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    console.log(`[auth] Login: ${user.email}`);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("[auth] Login error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ── POST /api/auth/google ───────────────────────────────────────────
router.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify the Google ID token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    // Find existing user by email (links Google to manual accounts)
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user — link Google if not already linked
      user.googleId = googleId;
      user.picture = picture || user.picture;
      user.name = name || user.name;
      if (!user.authProviders.includes("google")) {
        user.authProviders.push("google");
      }
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        picture,
        authProviders: ["google"],
        lastLoginAt: new Date(),
      });
    }

    const token = signToken(user);
    console.log(`[auth] Google login: ${user.email}`);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("[auth] Google login error:", err.message);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────
router.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("[auth] Me error:", err.message);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

export default router;
