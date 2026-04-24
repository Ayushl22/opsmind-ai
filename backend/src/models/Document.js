import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  text: String,
  embedding: [Number],
  source: String,
  page: Number
});

export default mongoose.model("Document", documentSchema);