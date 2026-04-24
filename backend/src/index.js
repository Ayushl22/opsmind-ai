import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("OpsMind AI Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});