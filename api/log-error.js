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
const { userId, email, source, message } = req.body || {};

```
await supabase.from("app_errors").insert({
  user_id: userId || null,
  email: email || null,
  source: source || "unknown",
  message: message || "Unknown error"
});

return res.status(200).json({
  success: true
});
```

} catch (error) {
return res.status(500).json({
error: error.message
});
}
}
