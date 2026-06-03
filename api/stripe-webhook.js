import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      success: true,
      message: "Stripe webhook endpoint is live. Waiting for Stripe events."
    });
  }

  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const rawBody = Buffer.concat(chunks);
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.client_reference_id;

      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          email: session.customer_details?.email,
          subscription_status: "active"
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "inactive"
          })
          .eq("id", userId);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            subscription_status:
              subscription.status === "active" ? "active" : "inactive"
          })
          .eq("id", userId);
      }
    }

    return res.status(200).json({
      received: true
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return res.status(400).json({
      error: error.message
    });
  }
}
