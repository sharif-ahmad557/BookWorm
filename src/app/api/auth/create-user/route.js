import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, photoURL, firebaseUid } = body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      photoURL,
      firebaseUid,
      role: "user",
      shelves: { wantToRead: [], currentlyReading: [], read: [] },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
