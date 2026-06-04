import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function startOfTodayISO() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { userId } = req.body || {};

    if (!userId) {
      return res.status(400).json({
        error: "Missing userId",
      });
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (adminError || !adminProfile?.is_admin) {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    const today = startOfTodayISO();

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
      .gte("created_at", today);

    const { count: foodLogsToday } = await supabase
      .from("food_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today);

    const { count: communityPostsToday } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today);

    const monthlyRevenue = Number(activeSubscribers || 0) * 19.99;

    return res.status(200).json({
      totalUsers: totalUsers || 0,
      activeSubscribers: activeSubscribers || 0,
      monthlyRevenue,
      checkinsToday: checkinsToday || 0,
      foodLogsToday: foodLogsToday || 0,
      communityPostsToday: communityPostsToday || 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
