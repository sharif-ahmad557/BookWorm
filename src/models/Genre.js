import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }, // URL এর জন্য (যেমন: sci-fi)
  },
  { timestamps: true }
);

export default mongoose.models.Genre || mongoose.model("Genre", GenreSchema);
