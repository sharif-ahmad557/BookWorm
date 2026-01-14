import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Review from "@/models/Review";
import Book from "@/models/Book"; 

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email }).populate({
      path: "shelves.read",
      populate: { path: "genre" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const booksRead = user.shelves.read.length || 0;
    const readingGoal = user.readingGoal?.target || 0;
    const progress =
      readingGoal > 0 ? Math.round((booksRead / readingGoal) * 100) : 0;

    const genreCounts = {};
    user.shelves.read.forEach((book) => {
      const genreName = book.genre?.name || "Unknown";
      genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
    });

    const genreData = Object.keys(genreCounts).map((key) => ({
      name: key,
      value: genreCounts[key],
    }));

    const reviews = await Review.find({ user: user.firebaseUid }); 

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
    const currentMonth = new Date().getMonth();

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthName = months[d.getMonth()];

      const count = reviews.filter((r) => {
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
    console.error("Stats Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
