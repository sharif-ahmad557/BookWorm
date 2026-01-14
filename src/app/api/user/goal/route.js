import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PATCH(req) {
  await dbConnect();
  try {
    const { email, target } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { "readingGoal.target": parseInt(target) },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Goal updated",
      target: updatedUser.readingGoal.target,
    });
  } catch (error) {
    console.error("Goal Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}
