import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, checkin, history } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Vitamind's AI Wellness Coach.

You provide supportive, practical wellness guidance around:
- mental wellness
- fitness
- nutrition
- motivation
- habit building
- stress recovery

Rules:
- Do not diagnose.
- Do not claim to be a therapist or doctor.
- Do not provide medical treatment.
- Keep responses short, warm, and practical.
- If the user mentions suicide, self-harm, abuse, overdose, or immediate danger, tell them to contact emergency services or a crisis hotline immediately.

Use the user's check-in scores to personalize the response.
          `,
        },
        {
          role: "user",
          content: `
Current check-in:
Depression: ${checkin?.depression}/10
Anxiety: ${checkin?.anxiety}/10
Stress: ${checkin?.stress}/10
Motivation: ${checkin?.motivation}/10
Energy: ${checkin?.energy}/10
Sleep: ${checkin?.sleep} hours

Recent history:
${JSON.stringify(history || [])}

User message:
${message}
          `,
        },
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI coach failed to respond.",
    });
  }
}
