import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  sources: [
    {
      fileName: String,
      section: String,
      confidence: Number,
      snippet: String,
    },
  ],
  scope: String,
  isOutOfContext: Boolean,
  error: Boolean,
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "New conversation" },
    messages: [messageSchema],
    documentIds: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
