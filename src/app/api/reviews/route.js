import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId)
    return NextResponse.json({ message: "Book ID required" }, { status: 400 });

  try {
    const reviews = await Review.find({ book: bookId, status: "approved" })
      .populate("user", "name photoURL")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const { bookId, userEmail, rating, comment } = await req.json();

    const user = await User.findOne({ email: userEmail });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const existingReview = await Review.findOne({
      book: bookId,
      user: user._id,
    });
    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this book" },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      user: user._id,
      book: bookId,
      rating,
      comment,
      status: "pending",
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
