import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    await Book.findByIdAndDelete(id);
    return NextResponse.json({ message: "Book deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
