import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!supabaseUrl) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or VITE_SUPABASE_URL" });
    }

    if (!serviceRoleKey) {
      return res.status(500).json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { userId } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (adminError) {
      return res.status(500).json({ error: adminError.message });
    }

    if (!adminProfile?.is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: activeSubscribers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "active");

    const { count: checkinsToday } = await supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    const { count: foodLogsToday } = await supabase
      .from("food_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    const { count: communityPostsToday } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    const { count: errorsToday } = await supabase
      .from("app_errors")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    const { data: latestErrors } = await supabase
      .from("app_errors")
      .select("id, source, message, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    return res.status(200).json({
      totalUsers: totalUsers || 0,
      activeSubscribers: activeSubscribers || 0,
      monthlyRevenue: Number(activeSubscribers || 0) * 19.99,
      checkinsToday: checkinsToday || 0,
      foodLogsToday: foodLogsToday || 0,
      communityPostsToday: communityPostsToday || 0,
      errorsToday: errorsToday || 0,
      latestErrors: latestErrors || [],
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Admin stats failed",
    });
  }
}
