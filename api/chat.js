import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

const FREE_TRIAL_DAILY_LIMIT = 20;
const PAID_DAILY_LIMIT = 100;
const MAX_BODY_SIZE = 50000;
const MAX_MESSAGE_LENGTH = 2000;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function cleanText(value, maxLength = MAX_MESSAGE_LENGTH) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function safeArray(value, limit) {
  return Array.isArray(value) ? value.slice(0, limit) : [];
}

async function getSubscriptionStatus(userId, fallbackStatus) {
  if (!userId || !supabaseAdmin) return fallbackStatus || "inactive";

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("subscription_status")
    .eq("id", userId)
    .maybeSingle();

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
        email: cleanText(email, 200),
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
  } else {
    await supabaseAdmin.from("ai_message_usage").insert({
      user_id: userId,
      email: cleanText(email, 200),
      usage_date: usageDate,
      message_count: 1,
      subscription_status: subscriptionStatus,
    });
  }
}

async function logApiError({ source, message, email, userId, details = {} }) {
  if (!supabaseAdmin) return;

  try {
    await supabaseAdmin.from("app_errors").insert({
      source,
      message: cleanText(message, 1000),
      email: cleanText(email, 200),
      user_id: userId || null,
      details,
    });
  } catch {
    // Do not let logging crash the API.
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const bodySize = JSON.stringify(req.body || {}).length;

    if (bodySize > MAX_BODY_SIZE) {
      return res.status(413).json({
        error: "Request too large.",
        reply: "That message is too large for the AI Coach. Please shorten it and try again.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY",
        reply: "The AI coach is not configured yet.",
      });
    }

    const {
      message,
      userId,
      email,
      subscriptionStatus: clientSubscriptionStatus,
      checkin,
      history,
      foodLog,
    } = req.body || {};

    const safeMessage = cleanText(message);

    if (!safeMessage) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!userId) {
      return res.status(401).json({
        error: "User must be logged in.",
        reply: "Please log in before using the AI Coach.",
      });
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
        usedToday,
        limit: dailyLimit,
        subscriptionStatus,
        reply: isPaid
          ? "You reached today's 100-message AI Coach safety limit. Please come back tomorrow."
          : "You reached today's free-trial AI Coach limit. Subscribe for up to 100 AI Coach messages per day.",
      });
    }

    const wellnessSummary = {
      currentCheckin: checkin || {},
      recentMoodHistory: safeArray(history, 7),
      recentFoodLog: safeArray(foodLog, 10),
      sleep: checkin?.sleep ?? null,
      exercise: checkin?.exercise ?? null,
    };

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 550,
      messages: [
        {
          role: "system",
          content:
            "You are Vitamind's AI Wellness Coach. Keep responses supportive, practical, and concise. Use the user's check-in scores, food log, sleep, exercise, and recent mood history. When helpful, include therapeutic coping skills from CBT, DBT-informed skills, ACT, mindfulness, grounding, trauma-informed regulation, behavioral activation, motivational interviewing, or ADHD skills coaching. Also suggest fitness and nutrition only when relevant. Do not diagnose, prescribe, or replace medical care. If the user mentions self-harm, suicide, danger, abuse, or emergency risk, encourage immediate emergency help or crisis support.",
        },
        {
          role: "user",
          content: `User message:\n${safeMessage}\n\nWellness context:\n${JSON.stringify(
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

    await logApiError({
      source: "api-chat",
      message: error.message || "AI coach failed",
      email: req.body?.email,
      userId: req.body?.userId,
      details: {
        status: error.status || null,
        type: error.type || null,
      },
    });

    return res.status(500).json({
      error: "AI coach failed.",
      reply: "The AI coach is having trouble connecting right now. Please try again shortly.",
    });
  }
}
