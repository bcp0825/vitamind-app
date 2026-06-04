import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Missing email",
      });
    }

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (!customers.data.length) {
      return res.status(404).json({
        error: "No Stripe customer found for this email.",
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: "https://www.the-vitamind.com",
    });

    return res.status(200).json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Portal Session Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
