import express from "express";
import Conversation from "../models/Conversation.js";

const router = express.Router();

/**
 * POST /api/conversations
 * Create a new conversation.
 * Body: { title?, documentIds? }
 */
router.post("/conversations", async (req, res) => {
  try {
    const { title, documentIds } = req.body;
    const conversation = await Conversation.create({
      title: title || "New conversation",
      messages: [],
      documentIds: documentIds || [],
    });

    console.log(`[conversations] Created conversation ${conversation._id}`);
    res.status(201).json(conversation);
  } catch (err) {
    console.error("[conversations] Create error:", err.message);
    res.status(500).json({ message: "Failed to create conversation", error: err.message });
  }
});

/**
 * GET /api/conversations
 * List all conversations (newest first), without full message bodies.
 */
router.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .select("title messages documentIds createdAt updatedAt")
      .lean();

    // Return a lightweight summary: id, title, first question, last answer preview, timestamps, source list
    const summaries = conversations.map((conv) => {
      const firstUserMsg = conv.messages.find((m) => m.type === "user");
      const lastAiMsg = [...(conv.messages || [])].reverse().find((m) => m.type === "ai");

      return {
        id: conv._id,
        title: conv.title,
        question: firstUserMsg?.content || "",
        preview: lastAiMsg?.content?.substring(0, 150) || "",
        messageCount: conv.messages.length,
        sources: lastAiMsg?.sources?.map((s) => s.fileName) || [],
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });

    res.json(summaries);
  } catch (err) {
    console.error("[conversations] List error:", err.message);
    res.status(500).json({ message: "Failed to fetch conversations", error: err.message });
  }
});

/**
 * GET /api/conversations/:id
 * Get a full conversation with all messages.
 */
router.get("/conversations/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    console.error("[conversations] Get error:", err.message);
    res.status(500).json({ message: "Failed to fetch conversation", error: err.message });
  }
});

/**
 * POST /api/conversations/:id/messages
 * Add a message to an existing conversation.
 * Body: { type: "user"|"ai", content, sources?, scope?, isOutOfContext?, error? }
 */
router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const { type, content, sources, scope, isOutOfContext, error: isError } = req.body;

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = { type, content, sources, scope, isOutOfContext, error: isError, timestamp: new Date() };
    conversation.messages.push(message);

    // Auto-set title from first user question
    if (conversation.title === "New conversation" && type === "user") {
      conversation.title = content.length > 80 ? content.substring(0, 80) + "…" : content;
    }

    await conversation.save();

    console.log(`[conversations] Added ${type} message to ${req.params.id}`);
    res.json(message);
  } catch (err) {
    console.error("[conversations] Add message error:", err.message);
    res.status(500).json({ message: "Failed to add message", error: err.message });
  }
});

/**
 * DELETE /api/conversations/:id
 * Delete a conversation.
 */
router.delete("/conversations/:id", async (req, res) => {
  try {
    const result = await Conversation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    console.log(`[conversations] Deleted conversation ${req.params.id}`);
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    console.error("[conversations] Delete error:", err.message);
    res.status(500).json({ message: "Failed to delete conversation", error: err.message });
  }
});

export default router;
