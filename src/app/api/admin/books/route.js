import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const books = await Book.find({})
      .populate("genre", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newBook = await Book.create(body);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
