import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import User from "@/models/User";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  try {
    const query = {};
    if (bookId) query.book = bookId;

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    return NextResponse.json(reviews || []);
  } catch (error) {
    console.error("Review Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { bookId, userEmail, rating, comment } = body;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newReview = await Review.create({
      book: bookId,
      user: user.firebaseUid,
      userName: user.name,
      userPhoto: user.photoURL,
      rating,
      comment,
      status: "pending",
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Review Submit Error:", error);
    return NextResponse.json(
      { message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
