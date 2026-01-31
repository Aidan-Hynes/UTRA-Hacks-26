import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!API_KEY) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not set in environment variables." },
            { status: 500 }
        );
    }

    try {
        const { message } = await req.json();
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Context for the Hackathon / Robot
        const systemPrompt = `
      You are 'Aerya', the advanced tactical AI for the UTRA Hacks Biathlon Robot.
      Your goal is to assist the pilot in winning the Winter Olympics themed robotics challenge.
      
      THE CHALLENGE DATA:
      - We are competing in a Biathlon: Target Shooting + Obstacle Course.
      - Core Rules: 
        1. Fetch battery -> Drop in white zone -> Unlock Path.
        2. Color Detection: Green Path = Shooting (Ramp -> Target), Red Path = Obstacle (Turns).
        3. Shooting: Hit the Blue Zone for max points (3pts), Green (1pt), Red (2pt).
        4. Obstacles: Don't touch black blocks (-1 pt).
        
      TONE: High-tech, brief, tactical, slight sarcasm if they make a bad strategic choice.
      Keep answers short (max 2 sentences) to fit the dashboard.
    `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Systems online. Aerya Tactical AI ready. Awaiting command parameters." }]
                }
            ]
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to communicate with AI core." },
            { status: 500 }
        );
    }
}
