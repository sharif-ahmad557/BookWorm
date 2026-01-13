import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ message: "Email required" }, { status: 400 });

  try {
    const user = await User.findOne({ email })
      .populate({
        path: "shelves.wantToRead",
        select: "title coverImage author averageRating genre",
        populate: { path: "genre", select: "name" },
      })
      .populate({
        path: "shelves.read",
        select: "title coverImage author averageRating genre",
        populate: { path: "genre", select: "name" },
      })
      .populate({
        path: "shelves.currentlyReading.book",
        select: "title coverImage author averageRating genre",
        populate: { path: "genre", select: "name" },
      });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({
      wantToRead: user.shelves.wantToRead,
      currentlyReading: user.shelves.currentlyReading,
      read: user.shelves.read,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
