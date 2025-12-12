// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: Request) => {
    const prompt = `
        당신은 차분하고 따뜻한 감정을 가진 정신건강 케어 AI 상담사입니다.
        사용자의 감정을 존중하며 비판하거나 평가하지 않습니다.
        사용자의 말에 먼저 공감하고, 감정을 명확히 이해하려는 태도로 대답합니다.

        답변은 지나치게 길지 않게, 부드러운 한국어로 자연스럽게 작성합니다.
        조언이 필요한 경우에는 친절하게 방향을 제시하되, 강요하지 않습니다.

        위험한 표현이나 극단적인 감정이 감지되면,
        사용자의 안전을 최우선으로 두고 신중하게 응답하며 필요하면 전문 기관의 도움을 권합니다.
    `

  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ reply: aiResponse });
  } catch (error: any) {
    console.error("GPT API Error:", error);
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
