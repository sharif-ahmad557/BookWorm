import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Review from "@/models/Review";
import Book from "@/models/Book";
import Genre from "@/models/Genre"; 

export const dynamic = "force-dynamic";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const user = await User.findOne({ email })
      .populate({
        path: "shelves.read",
        populate: { path: "genre" },
      })
      .populate("favoriteGenres");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const booksRead = user.shelves?.read?.length || 0;
    const readingGoal = user.readingGoal?.target || 50;
    const progress =
      readingGoal > 0 ? Math.round((booksRead / readingGoal) * 100) : 0;

    let genreData = [];

    if (Array.isArray(user.favoriteGenres) && user.favoriteGenres.length > 0) {
      genreData = user.favoriteGenres.map((g) => ({
        name: g.name || "Genre",
        value: 1,
      }));
    }
    else if (user.shelves?.read && user.shelves.read.length > 0) {
      const genreCounts = {};
      user.shelves.read.forEach((book) => {
        if (book && book.genre) {
          const gName = book.genre.name || "Unknown";
          genreCounts[gName] = (genreCounts[gName] || 0) + 1;
        }
      });
      genreData = Object.keys(genreCounts).map((key) => ({
        name: key,
        value: genreCounts[key],
      }));
    }
    else {
      genreData = [{ name: "No Data", value: 1 }];
    }

    let reviews = [];
    try {
      reviews = await Review.find({
        $or: [
          { user: user.firebaseUid }, 
          { user: user._id },
        ],
      });
    } catch (e) {
      console.log("Review fetch ignored:", e.message);
      reviews = [];
    }

    const monthlyData = [];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];

      const count = reviews.filter((r) => {
        if (!r.createdAt) return false;
        const rDate = new Date(r.createdAt);
        return (
          rDate.getMonth() === d.getMonth() &&
          rDate.getFullYear() === d.getFullYear()
        );
      }).length;

      monthlyData.push({ name: monthName, books: count });
    }

    return NextResponse.json({
      booksRead,
      readingGoal,
      progress,
      genreData,
      monthlyData,
    });
  } catch (error) {
    console.error("🔥 Stats API Final Catch:", error);

    return NextResponse.json({
      booksRead: 0,
      readingGoal: 50,
      progress: 0,
      genreData: [{ name: "Error", value: 1 }],
      monthlyData: [],
    });
  }
}
