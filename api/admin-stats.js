import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.VITE_SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({
error: "Method not allowed"
});
}

try {
const totalUsers = 0;
const activeSubscribers = 0;

```
return res.status(200).json({
  totalUsers,
  activeSubscribers,
  monthlyRevenue: activeSubscribers * 19.99,
  checkinsToday: 0,
  foodLogsToday: 0,
  communityPostsToday: 0,
  errorsToday: 0,
  latestErrors: []
});
```

} catch (error) {
return res.status(500).json({
error: error.message
});
}
}
