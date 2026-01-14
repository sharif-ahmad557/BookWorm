import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";
import User from "@/models/User";
import Review from "@/models/Review";
import Genre from "@/models/Genre";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: "pending" });
    const totalGenres = await Genre.countDocuments();

    const booksPerGenre = await Book.aggregate([
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genreInfo",
        },
      },
      { $unwind: "$genreInfo" },
      {
        $group: {
          _id: "$genreInfo.name",
          count: { $sum: 1 },
        },
      },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ]);

    return NextResponse.json({
      stats: {
        totalBooks,
        totalUsers,
        pendingReviews,
        totalGenres,
      },
      chartData: booksPerGenre,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
