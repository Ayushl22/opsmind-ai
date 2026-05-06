import express from "express";
import multer from "multer";
import parsePDF from "../services/pdfParser.js";
import chunkText from "../services/chunker.js";
import getEmbedding from "../services/embedder.js";
import Document from "../models/Document.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * Process chunks in parallel batches to avoid sequential API calls.
 * @param {string[]} chunks - Text chunks to embed
 * @param {string} sourceName - Original filename
 * @param {number} concurrency - Max parallel embedding calls
 */
const processChunksInBatches = async (chunks, sourceName, concurrency = 5) => {
  for (let i = 0; i < chunks.length; i += concurrency) {
    const batch = chunks.slice(i, i + concurrency);
    console.log(`🔹 Processing batch ${Math.floor(i / concurrency) + 1} (chunks ${i + 1}–${i + batch.length}/${chunks.length})`);

    await Promise.all(
      batch.map(async (chunkText) => {
        const embedding = await getEmbedding(chunkText);
        await Document.create({
          text: chunkText,
          embedding,
          source: sourceName,
          page: 1,
        });
      })
    );
  }
};

// ── POST /api/upload — Upload and process a PDF ──
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("🚀 Upload API Hit");

    const filePath = req.file.path;
    console.log("📁 File received:", filePath);

    const text = await parsePDF(filePath);
    console.log("📄 Text extracted length:", text.length);

    const chunks = chunkText(text);
    console.log("✂️ Chunks created:", chunks.length);

    await processChunksInBatches(chunks, req.file.originalname);

    console.log("✅ All chunks saved to DB");

    // Return a document object the frontend can use
    res.json({
      message: "Upload + Processing Done",
      document: {
        fileName: req.file.originalname,
        status: "ready",
        pages: chunks.length,
        uploadedOn: new Date().toISOString().split("T")[0],
      },
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// ── GET /api/documents — List all unique uploaded documents ──
router.get("/documents", async (req, res) => {
  try {
    // Get unique source names and count chunks per document
    const documents = await Document.aggregate([
      {
        $group: {
          _id: "$source",
          chunks: { $sum: 1 },
          createdAt: { $min: "$_id" }, // approximate upload time from ObjectId
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const result = documents.map((doc, index) => ({
      id: String(index + 1),
      fileName: doc._id,
      uploadedOn: doc.createdAt.getTimestamp
        ? doc.createdAt.getTimestamp().toISOString().split("T")[0]
        : "Unknown",
      status: "ready",
      pages: doc.chunks,
    }));

    console.log(`[documents] Returning ${result.length} documents`);
    res.json(result);
  } catch (err) {
    console.error("[documents] Error fetching documents:", err.message);
    res.status(500).json({ message: "Failed to fetch documents", error: err.message });
  }
});

// ── DELETE /api/documents/:source — Delete a specific document by source name ──
router.delete("/documents/:source", async (req, res) => {
  try {
    const sourceName = decodeURIComponent(req.params.source);
    const result = await Document.deleteMany({ source: sourceName });
    console.log(`🗑️ Deleted ${result.deletedCount} chunks for "${sourceName}"`);

    res.json({ message: `Deleted ${sourceName}`, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// ── DELETE /api/clear — Delete ALL documents ──
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