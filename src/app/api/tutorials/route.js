import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tutorial from "@/models/Tutorial";

function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function GET() {
  await dbConnect();
  try {
    const tutorials = await Tutorial.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tutorials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tutorials" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { title, videoUrl, description } = body;

    const videoId = getYouTubeID(videoUrl);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const newTutorial = await Tutorial.create({
      title,
      videoUrl,
      videoId,
      description,
    });

    return NextResponse.json(newTutorial, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add tutorial" },
      { status: 500 }
    );
  }
}
