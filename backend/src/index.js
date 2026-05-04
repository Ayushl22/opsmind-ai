import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/upload.js";
import queryRoutes from "./routes/query.js";

connectDB();

const app = express();
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", queryRoutes);

app.get("/", (req, res) => {
  res.send("OpsMind AI Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});