import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const customerEmail = fullSession.customer_details?.email || "unknown";
    const total = (fullSession.amount_total || 0) / 100;
    const lineItems = fullSession.line_items?.data.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      price: (item.amount_total || 0) / 100,
    }));

    // Save the order to Supabase
    await supabaseAdmin.from("orders").insert({
      customer_email: customerEmail,
      items: lineItems,
      total: total,
      stripe_session_id: session.id,
    });

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Aurora Store <onboarding@resend.dev>",
        to: customerEmail,
        subject: "Your Aurora Store Order Confirmation",
        html: `
          <h1>Thank you for your order!</h1>
          <p>We've received your payment of $${total.toFixed(2)}.</p>
          <ul>
            ${lineItems
              ?.map((item) => `<li>${item.quantity} × ${item.name} — $${item.price.toFixed(2)}</li>`)
              .join("")}
          </ul>
          <p>We'll notify you when your order ships.</p>
        `,
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }
  }

  return NextResponse.json({ received: true });
}