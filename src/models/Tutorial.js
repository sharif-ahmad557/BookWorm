import mongoose from "mongoose";

const TutorialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // ইউজার যে লিংক দিবে
    videoId: { type: String, required: true }, // ইউটিউব ভিডিওর আসল ID (API তে বের করে নিব)
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Tutorial ||
  mongoose.model("Tutorial", TutorialSchema);
