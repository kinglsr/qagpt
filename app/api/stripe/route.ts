/* eslint-disable no-undef */
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createPaymentDetails } from "@/lib/actions/payments.action";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body: any = await req.text();
  const sig = headers().get("stripe-signature") as string;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Successfully constructed event.
  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          try {
            const session = await stripe.checkout.sessions.retrieve(data.id, {
              expand: ["line_items", "invoice"],
            });

            await createPaymentDetails(session);
            console.log(`🔔  Payment received!`);

            console.log(`💰 CheckoutSession status: ${data.payment_status}`);
          } catch (error) {
            console.log(
              `❌ Error retrieving checkout session: ${
                (error as Error).message
              }`
            );
            return new Response(`Webhook Error: ${(error as Error).message}`, {
              status: 400,
            });
          }
          break;

        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
