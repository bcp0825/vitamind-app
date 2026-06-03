import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        error: "Missing userId or email",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      client_reference_id: userId,

      line_items: [
        {
          price: "price_1TdYcX0RJZgQyAZPt5z5BQaO",
          quantity: 1,
        },
      ],

      success_url: "https://www.the-vitamind.com/?subscription=success",
      cancel_url: "https://www.the-vitamind.com/?subscription=cancelled",

      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },

      metadata: {
        user_id: userId,
      },
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout Session Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
