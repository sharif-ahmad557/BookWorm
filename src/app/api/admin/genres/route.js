import dbConnect from "@/lib/dbConnect";
import Genre from "@/models/Genre";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  await dbConnect();
  try {
    const genres = await Genre.find({}).sort({ createdAt: -1 });
    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const { name } = await req.json();

    const existing = await Genre.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { error: "Genre already exists" },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true });
    const genre = await Genre.create({ name, slug });

    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
