import "dotenv/config.js";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/upload.js";
import queryRoutes from "./routes/query.js";
import conversationRoutes from "./routes/conversations.js";
import authRoutes from "./routes/auth.js";

connectDB();

// ── Validate critical env vars at startup ──
if (!process.env.GEMINI_API_KEY) {
  console.error("\n❌ GEMINI_API_KEY is missing from .env — embeddings and chat will fail!");
} else if (!process.env.GEMINI_API_KEY.startsWith("AIza")) {
  console.warn("\n⚠️  GEMINI_API_KEY does not look like a valid Google API key (should start with 'AIza')");
} else {
  console.log("✅ GEMINI_API_KEY loaded (", process.env.GEMINI_API_KEY.slice(0, 8) + "...)");
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing from .env — auth will fail!");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn("⚠️  GOOGLE_CLIENT_ID is missing — Google login will be disabled");
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", queryRoutes);
app.use("/api", conversationRoutes);

app.get("/", (req, res) => {
  res.send("OpsMind AI Backend Running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});