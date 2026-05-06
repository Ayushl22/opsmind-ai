import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String }, // only for manual auth
    googleId: { type: String },     // only for Google auth
    picture: { type: String },      // avatar URL
    authProviders: {
      type: [String],
      enum: ["manual", "google"],
      default: [],
    },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
