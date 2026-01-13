import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Book from "@/models/Book";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    let recommendedBooks = [];
    let reason = "";

    if (email) {
      const user = await User.findOne({ email }).populate({
        path: "shelves.read",
        populate: { path: "genre" },
      });

      if (user && user.shelves.read.length > 0) {
        const genres = user.shelves.read.map((book) =>
          book.genre?._id.toString()
        );

        const genreFrequency = {};
        genres.forEach((g) => {
          if (g) genreFrequency[g] = (genreFrequency[g] || 0) + 1;
        });

        const topGenreId = Object.keys(genreFrequency).reduce((a, b) =>
          genreFrequency[a] > genreFrequency[b] ? a : b
        );

        const readBookIds = user.shelves.read.map((b) => b._id);

        recommendedBooks = await Book.find({
          genre: topGenreId,
          _id: { $nin: readBookIds },
        })
          .sort({ averageRating: -1 })
          .limit(8)
          .populate("genre");

        reason =
          "Because you like " +
          user.shelves.read.find((b) => b.genre._id.toString() === topGenreId)
            ?.genre?.name;
      }
    }

    if (recommendedBooks.length < 4) {
      const popularBooks = await Book.find({
        _id: { $nin: recommendedBooks.map((b) => b._id) },
      })
        .sort({ averageRating: -1 })
        .limit(8 - recommendedBooks.length)
        .populate("genre");

      recommendedBooks = [...recommendedBooks, ...popularBooks];
      if (!reason) reason = "Popular on BookWorm";
    }

    return NextResponse.json({ books: recommendedBooks, reason });
  } catch (error) {
    console.error("Recommendation Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
