import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tutorial from "@/models/Tutorial";

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    console.log("🔥 attempting to delete ID:", id);

    const deletedTutorial = await Tutorial.findByIdAndDelete(id);

    if (!deletedTutorial) {
      console.log("❌ Tutorial not found in Database for ID:", id);
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 }
      );
    }

    console.log("✅ Successfully deleted:", id);
    return NextResponse.json({ message: "Tutorial deleted successfully" });
  } catch (error) {
    console.error("💀 Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete tutorial" },
      { status: 500 }
    );
  }
}
