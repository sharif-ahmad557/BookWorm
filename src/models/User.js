import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    firebaseUid: { type: String, required: true, unique: true },

    shelves: {
      wantToRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
      currentlyReading: [
        {
          book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
          progress: { type: Number, default: 0 },
        },
      ],
      read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    },

    readingGoal: {
      year: { type: Number, default: new Date().getFullYear() },
      target: { type: Number, default: 50 },
    },

    // 👇👇👇 এই লাইনটি মিসিং থাকার কারণেই এরর আসছে 👇👇👇
    favoriteGenres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
