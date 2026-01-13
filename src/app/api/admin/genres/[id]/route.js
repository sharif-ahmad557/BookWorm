import dbConnect from "@/lib/dbConnect";
import Genre from "@/models/Genre";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const { name } = await req.json();

  try {
    const slug = slugify(name, { lower: true });
    const updatedGenre = await Genre.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );
    return NextResponse.json(updatedGenre);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    await Genre.findByIdAndDelete(id);
    return NextResponse.json({ message: "Genre deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
