import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Review from "@/models/Review";
import Book from "@/models/Book";
import Genre from "@/models/Genre";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  console.log("📊 Stats API Requested for:", email);

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email }).populate({
      path: "shelves.read",
      populate: { path: "genre" },
    });

    if (!user) {
      console.log("❌ Stats API: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const booksRead = user.shelves?.read?.length || 0;
    const readingGoal = user.readingGoal?.target || 50;
    const progress =
      readingGoal > 0 ? Math.round((booksRead / readingGoal) * 100) : 0;

    const genreCounts = {};
    if (user.shelves?.read) {
      user.shelves.read.forEach((book) => {
        const genreName = book.genre?.name || "Other";
        genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
      });
    }
    const genreData = Object.keys(genreCounts).map((key) => ({
      name: key,
      value: genreCounts[key],
    }));

    let reviews = [];
    try {
      const userId = user.firebaseUid;
      const mongoId = user._id;
      reviews = await Review.find({
        $or: [{ user: userId }, { user: mongoId }],
      });
    } catch (reviewError) {
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
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    for (let i = 5; i >= 0; i--) {
      let targetMonthIndex = currentMonth - i;
      let targetYear = currentYear;

      if (targetMonthIndex < 0) {
        targetMonthIndex += 12;
        targetYear -= 1;
      }
      const monthName = months[targetMonthIndex];
      const count = reviews.filter((r) => {
        const rDate = new Date(r.createdAt);
        return (
          rDate.getMonth() === targetMonthIndex &&
          rDate.getFullYear() === targetYear
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
    console.error("🔥 Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
