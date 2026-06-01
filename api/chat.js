import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({
        reply: "API route exists. Use the AI Coach chat to test POST.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "ERROR: OPENAI_API_KEY is missing in Vercel Environment Variables.",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message, checkin } = req.body || {};

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Vitamind's AI Wellness Coach. Give short, supportive wellness guidance. Do not diagnose or provide medical treatment.",
        },
        {
          role: "user",
          content: `
Check-in:
Depression: ${checkin?.depression}/10
Anxiety: ${checkin?.anxiety}/10
Stress: ${checkin?.stress}/10
Motivation: ${checkin?.motivation}/10
Energy: ${checkin?.energy}/10
Sleep: ${checkin?.sleep} hours

User message:
${message}
          `,
        },
      ],
    });

    return res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    return res.status(200).json({
      reply: "OPENAI ERROR: " + error.message,
    });
  }
}
