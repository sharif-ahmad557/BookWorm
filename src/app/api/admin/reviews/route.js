import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const reviews = await Review.find({ status: "pending" })
      .populate("user", "name email photoURL")
      .populate("book", "title coverImage")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();
  try {
    const { reviewId, action } = await req.json(); // action: 'approve' or 'reject'

    if (action === "reject") {
      await Review.findByIdAndDelete(reviewId);
      return NextResponse.json({ message: "Review rejected/deleted" });
    }

    if (action === "approve") {
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { status: "approved" },
        { new: true }
      );

      const bookId = review.book;
      const allReviews = await Review.find({
        book: bookId,
        status: "approved",
      });

      const totalRatings = allReviews.length;
      const averageRating =
        allReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings;

      await Book.findByIdAndUpdate(bookId, {
        totalRatings,
        averageRating,
      });

      return NextResponse.json({
        message: "Review approved and rating updated",
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
