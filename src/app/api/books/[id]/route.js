import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, context) {
  await dbConnect();

  const params = await context.params;
  const id = params.id;

  console.log("Fetching Book ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  try {
    const book = await Book.findById(id).populate("genre", "name");

    if (!book) {
      return NextResponse.json(
        { message: "Book not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
