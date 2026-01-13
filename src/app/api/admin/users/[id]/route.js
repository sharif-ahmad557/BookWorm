import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PATCH(req, { params }) {
  await dbConnect();

  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await req.json();
    const { role } = body; 

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
