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
    const filePath = req.file.path;

    const text = await parsePDF(filePath);
    const chunks = chunkText(text);

    for (let chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      await Document.create({
        text: chunk,
        embedding,
        source: req.file.originalname,
        page: 1
      });
    }

    res.json({ message: "Upload + Processing Done" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

export default router;