import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getTodayISO() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const bodySize = JSON.stringify(req.body || {}).length;
    if (bodySize > 10000) {
      return res.status(413).json({ error: "Request too large" });
    }

    if (!supabaseUrl) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or VITE_SUPABASE_URL" });
    }

    if (!serviceRoleKey) {
      return res.status(500).json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { userId } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .maybeSingle();

    if (adminError) {
      return res.status(500).json({ error: adminError.message });
    }

    if (!adminProfile?.is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const todayISO = getTodayISO();

    const [
      totalUsersResult,
      activeSubscribersResult,
      checkinsTodayResult,
      foodLogsTodayResult,
      communityPostsTodayResult,
      errorsTodayResult,
      aiUsageTodayResult,
      flaggedPostsResult,
      latestErrorsResult,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "estimated", head: true }),

      supabase
        .from("profiles")
        .select("id", { count: "estimated", head: true })
        .eq("subscription_status", "active"),

      supabase
        .from("checkins")
        .select("id", { count: "estimated", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("food_logs")
        .select("id", { count: "estimated", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("community_posts")
        .select("id", { count: "estimated", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("app_errors")
        .select("id", { count: "estimated", head: true })
        .gte("created_at", todayISO),

      supabase
        .from("ai_message_usage")
        .select("message_count")
        .gte("usage_date", new Date().toISOString().slice(0, 10)),

      supabase
        .from("community_posts")
        .select("id", { count: "estimated", head: true })
        .eq("flagged", true),

      supabase
        .from("app_errors")
        .select("id, source, message, email, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const aiMessagesToday = (aiUsageTodayResult.data || []).reduce(
      (sum, row) => sum + Number(row.message_count || 0),
      0
    );

    return res.status(200).json({
      totalUsers: totalUsersResult.count || 0,
      activeSubscribers: activeSubscribersResult.count || 0,
      monthlyRevenue: Number(activeSubscribersResult.count || 0) * 19.99,
      checkinsToday: checkinsTodayResult.count || 0,
      foodLogsToday: foodLogsTodayResult.count || 0,
      communityPostsToday: communityPostsTodayResult.count || 0,
      errorsToday: errorsTodayResult.count || 0,
      aiMessagesToday,
      flaggedPosts: flaggedPostsResult.count || 0,
      latestErrors: latestErrorsResult.data || [],
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Admin stats failed",
    });
  }
}
