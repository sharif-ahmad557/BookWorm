import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const genre = searchParams.get("genre");

  try {
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Case insensitive
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (genre && genre !== "All") {
      query.genre = genre;
    }

    const books = await Book.find(query)
      .populate("genre", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
