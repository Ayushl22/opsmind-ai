import express from "express";
import multer from "multer";
import parsePDF from "../services/pdfParser.js";
import chunkText from "../services/chunker.js";
import getEmbedding from "../services/embedder.js";
import Document from "../models/Document.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("🚀 Upload API Hit");

    const filePath = req.file.path;
    console.log("📁 File received:", filePath);

    const text = await parsePDF(filePath);
    console.log("📄 Text extracted length:", text.length);

    const chunks = chunkText(text);
    console.log("✂️ Chunks created:", chunks.length);

    for (let i = 0; i < chunks.length; i++) {
      console.log(`🔹 Processing chunk ${i + 1}/${chunks.length}`);

      const embedding = await getEmbedding(chunks[i]);

      await Document.create({
        text: chunks[i],
        embedding,
        source: req.file.originalname,
        page: 1
      });
    }

    console.log("✅ All chunks saved to DB");

    res.json({ message: "Upload + Processing Done" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).send("Error");
  }
});

router.delete("/clear", async (req, res) => {
  try {
    await Document.deleteMany({});
    console.log("🗑️ All documents deleted");

    res.json({ message: "All documents deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;