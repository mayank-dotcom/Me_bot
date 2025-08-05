import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Missing audio file in request body" },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioFile], "audio.webm", { type: audioFile.type }),
      model: "whisper-1",
    });

    const transcribedText = transcription.text;

    if (!transcribedText || transcribedText.trim() === "") {
     
        return NextResponse.json(
            { error: "Could not understand audio or empty audio provided." },
            { status: 400 }
        );
    }

    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const aiResponse = await fetch(`${baseUrl}/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: transcribedText }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("❌ Error from /api/ai:", errorText);
      return NextResponse.json(
        { error: `Failed to get response from AI service: ${aiResponse.statusText}` },
        { status: aiResponse.status }
      );
    }

    // Return the audio response from the /api/ai endpoint
    return new NextResponse(aiResponse.body, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (error) {
    console.error("❌ Error in /api/talk:", error);
    if (error instanceof OpenAI.APIError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
