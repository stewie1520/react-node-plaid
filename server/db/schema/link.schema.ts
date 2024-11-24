import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

export const LinkModel = mongoose.model("Link", linkSchema);
