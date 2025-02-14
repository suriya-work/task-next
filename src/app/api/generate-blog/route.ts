import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, topic, keywords, tone, audience, length } = await req.json();

    // استفاده از API Key جدید از محیط
    const response = await fetch("https://api.metisai.ir/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.METISAI_API_KEY || "", // استفاده از API Key جدید
      },
      body: JSON.stringify({
        title: title,
        topic: topic,
        keywords: keywords,
        tone: tone,
        audience: audience,
        length: length,
      }),
    });

    const data = await response.json();
    console.log("MetisAI API Response:", data);

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to generate blog." }, { status: response.status });
    }

    return NextResponse.json({ blog: data.output }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);  
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
