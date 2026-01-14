import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Genre from "@/models/Genre";

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await req.json();
    const { name } = body;

    console.log("Updating Genre ID:", id); 

    const updatedGenre = await Genre.findByIdAndUpdate(
      id,
      { name, slug: name.toLowerCase().replace(/ /g, "-") },
      { new: true }
    );

    if (!updatedGenre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGenre);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update genre" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    console.log("Deleting Genre ID:", id); 

    const deletedGenre = await Genre.findByIdAndDelete(id);

    if (!deletedGenre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Genre deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete genre" },
      { status: 500 }
    );
  }
}
