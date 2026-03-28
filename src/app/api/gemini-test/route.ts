import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function GET() {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ 
      error: "GROQ_API_KEY not set in .env.local" 
    }, { status: 500 });
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{
          role: "user",
          content: `You are Lega-AI. A seller listed an "iPhone 13 Pro" for 45000 ETB. 
          Respond ONLY with this exact JSON:
          {"verified":true,"confidence":94,"condition":"Good","aiSummary":"AI confirmed: The item appears to be a genuine iPhone 13 Pro. Device is powered on. Condition is good with minor wear. No signs of fraud detected."}`
        }],
        temperature: 0.1,
        max_tokens: 200,
      }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ 
        success: false, 
        groqError: data.error.message,
        type: data.error.type,
      }, { status: 400 });
    }

    const text = data?.choices?.[0]?.message?.content || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json({ 
      success: true, 
      message: "✅ Groq AI is working! Real AI verification is LIVE.",
      model: "llama-3.2-11b-vision-preview",
      result
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 500 });
  }
}
