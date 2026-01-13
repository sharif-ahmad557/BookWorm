import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const bookId = searchParams.get("bookId");

  if (!email || !bookId) return NextResponse.json({ shelf: "" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    let shelf = "";

    if (user.shelves.wantToRead.includes(bookId)) shelf = "wantToRead";
    else if (user.shelves.read.includes(bookId)) shelf = "read";
    else if (
      user.shelves.currentlyReading.some(
        (item) => item.book.toString() === bookId
      )
    )
      shelf = "currentlyReading";

    return NextResponse.json({ shelf });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const { email, bookId, shelf } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.shelves.wantToRead.pull(bookId);
    user.shelves.read.pull(bookId);
    user.shelves.currentlyReading = user.shelves.currentlyReading.filter(
      (item) => item.book.toString() !== bookId
    );

    if (shelf === "wantToRead") {
      user.shelves.wantToRead.push(bookId);
    } else if (shelf === "read") {
      user.shelves.read.push(bookId);
    } else if (shelf === "currentlyReading") {
      user.shelves.currentlyReading.push({ book: bookId, progress: 0 });
    }

    await user.save();

    return NextResponse.json({ message: "Shelf updated successfully", shelf });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
