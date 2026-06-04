import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, checkin, history, foodLog } = req.body;

    const recentCheckins = (history || []).slice(0, 7);
    const recentFoods = (foodLog || []).slice(0, 10);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Vitamind AI Coach. You support mental wellness, fitness, nutrition, habit-building, and motivation.

Use the user's recent check-ins and food logs to personalize your answer.

Do not diagnose medical conditions.
Do not replace therapy, medical care, or emergency support.
If the user mentions self-harm, suicidal thoughts, harming others, or crisis, tell them to call 988 or emergency services immediately.

Be supportive, practical, clear, and encouraging.
Give short actionable steps.
          `,
        },
        {
          role: "user",
          content: `
User message:
${message}

Current check-in:
${JSON.stringify(checkin, null, 2)}

Recent check-ins:
${JSON.stringify(recentCheckins, null, 2)}

Recent food logs:
${JSON.stringify(recentFoods, null, 2)}
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Coach Error:", error);

    return res.status(500).json({
      reply: "The AI coach is having trouble connecting right now.",
      error: error.message,
    });
  }
}
