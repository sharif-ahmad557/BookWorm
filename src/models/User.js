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
    // ফায়ারবেসের UID আমরা এখানে সেভ রাখবো ফিউচার রেফারেন্সের জন্য
    firebaseUid: { type: String, required: true, unique: true },

    // লাইব্রেরি শেলফ
    shelves: {
      wantToRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
      currentlyReading: [
        {
          book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
          progress: { type: Number, default: 0 }, // কত পেজ বা % পড়া হয়েছে
        },
      ],
      read: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    },

    // রিডিং চ্যালেঞ্জ (বোনাস ফিচার)
    readingGoal: {
      year: { type: Number, default: new Date().getFullYear() },
      target: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
