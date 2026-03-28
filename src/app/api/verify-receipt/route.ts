import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { image, itemDescription, price } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
       // Mock response if API key is missing for demo purposes
       await new Promise(resolve => setTimeout(resolve, 3000));
       return NextResponse.json({ 
         verified: true, 
         confidence: 0.95, 
         details: "Mock: Receipt matches item description and price." 
       });
    }

    // Extract base64 image data
    const base64Image = image.split(",")[1];
    const mediaType = image.split(";")[0].split(":")[1];

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Escrow Auditor for Lega-AI in Ethiopia. 
              Verify this "Lega" (Bus) receipt against the following item:
              Item: ${itemDescription}
              Price: ${price} ETB
              
              Analyze:
              1. Is this a genuine Ethiopian bus receipt (Lega)?
              2. Does the date look valid?
              3. Is there any mention of the item or a similar category?
              4. Does the price or fees match?
              
              Return a JSON object: 
              { "verified": boolean, "confidence": number, "reasoning": string, "extractedDetails": object }`
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as any,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    // Basic JSON extraction from Claude's response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { verified: false, reasoning: "Could not parse AI response" };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AI Verification Error:", error);
    return NextResponse.json({ error: "Verification failed", details: error.message }, { status: 500 });
  }
}
