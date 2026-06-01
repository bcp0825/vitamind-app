```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const { message, checkin } = req.body || {};

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
You are Vitamind's AI Wellness Coach.

You help users with:
- stress
- anxiety
- wellness
- fitness
- motivation
- healthy habits
- nutrition
- recovery

Rules:
- Never diagnose medical conditions
- Never claim to be a doctor or therapist
- Keep responses supportive and practical
- Encourage healthy coping skills
- Keep responses concise and motivational
          `,
        },

        {
          role: "user",
          content: `
Current Check-In:

Depression: ${checkin?.depression}/10
Anxiety: ${checkin?.anxiety}/10
Stress: ${checkin?.stress}/10
Motivation: ${checkin?.motivation}/10
Energy: ${checkin?.energy}/10
Sleep: ${checkin?.sleep} hours

User Message:
${message}
          `,
        },
      ],
    });

    return res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "The AI coach is temporarily unavailable.",
    });
  }
}
```
