import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  try {
    const { email, genreIds } = await req.json();

    console.log("Updating favorites for:", email, "IDs:", genreIds); // ডিবাগ লগ

    const user = await User.findOneAndUpdate(
      { email },
      { favoriteGenres: genreIds },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Favorites updated successfully" });
  } catch (error) {
    console.error("Fav Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
