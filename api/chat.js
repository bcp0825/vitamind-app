import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

const FREE_TRIAL_DAILY_LIMIT = 20;
const PAID_DAILY_LIMIT = 100;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function getSubscriptionStatus(userId, fallbackStatus) {
  if (!userId || !supabaseAdmin) return fallbackStatus || "inactive";

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("subscription_status")
    .eq("id", userId)
    .single();

  if (error || !data) return fallbackStatus || "inactive";
  return data.subscription_status || fallbackStatus || "inactive";
}

async function getTodayUsage(userId) {
  if (!userId || !supabaseAdmin) return 0;

  const { data, error } = await supabaseAdmin
    .from("ai_message_usage")
    .select("message_count")
    .eq("user_id", userId)
    .eq("usage_date", todayKey())
    .maybeSingle();

  if (error || !data) return 0;
  return Number(data.message_count || 0);
}

async function incrementTodayUsage({ userId, email, subscriptionStatus }) {
  if (!userId || !supabaseAdmin) return;

  const usageDate = todayKey();

  const { data } = await supabaseAdmin
    .from("ai_message_usage")
    .select("id, message_count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle();

  if (data?.id) {
    await supabaseAdmin
      .from("ai_message_usage")
      .update({
        message_count: Number(data.message_count || 0) + 1,
        email,
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
  } else {
    await supabaseAdmin.from("ai_message_usage").insert({
      user_id: userId,
      email,
      usage_date: usageDate,
      message_count: 1,
      subscription_status: subscriptionStatus,
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      message,
      userId,
      email,
      subscriptionStatus: clientSubscriptionStatus,
      checkin,
      history,
      foodLog,
    } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const subscriptionStatus = await getSubscriptionStatus(
      userId,
      clientSubscriptionStatus
    );

    const isPaid = subscriptionStatus === "active";
    const dailyLimit = isPaid ? PAID_DAILY_LIMIT : FREE_TRIAL_DAILY_LIMIT;
    const usedToday = await getTodayUsage(userId);

    if (usedToday >= dailyLimit) {
      return res.status(429).json({
        error: "Daily AI Coach limit reached.",
        reply: isPaid
          ? "You reached today's 100-message AI Coach safety limit. Please come back tomorrow."
          : "You reached today's free-trial AI Coach limit. Subscribe for up to 100 AI Coach messages per day.",
      });
    }

    const wellnessSummary = {
      currentCheckin: checkin || {},
      recentMoodHistory: Array.isArray(history) ? history.slice(0, 7) : [],
      recentFoodLog: Array.isArray(foodLog) ? foodLog.slice(0, 10) : [],
      sleep: checkin?.sleep ?? null,
      exercise: checkin?.exercise ?? null,
    };

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.65,
      max_tokens: 650,
      messages: [
        {
          role: "system",
          content:
            "You are Vitamind's AI Wellness Coach. Use check-in scores, food log, sleep, exercise, and mood history. Give supportive, practical suggestions. Include therapeutic coping skills when helpful using CBT, DBT-informed skills, ACT, mindfulness, grounding, trauma-informed regulation, behavioral activation, or ADHD skills coaching. Also suggest fitness and nutrition when relevant. Do not diagnose or replace medical care. For crisis or danger, direct the user to emergency services or crisis support.",
        },
        {
          role: "user",
          content: `User message:\n${message}\n\nWellness context:\n${JSON.stringify(
            wellnessSummary,
            null,
            2
          )}`,
        },
      ],
    });

    await incrementTodayUsage({ userId, email, subscriptionStatus });

    return res.status(200).json({
      reply:
        response.choices?.[0]?.message?.content ||
        "I’m having trouble responding right now. Try again.",
      usedToday: usedToday + 1,
      limit: dailyLimit,
      subscriptionStatus,
    });
  } catch (error) {
    console.error("AI coach error:", error);
    return res.status(500).json({
      error: error.message,
      reply: "The AI coach is having trouble connecting right now.",
    });
  }
}
