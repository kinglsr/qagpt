"use server";

import type { Stripe } from "stripe";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { getMongoUserDetails } from "@/components/shared/GetMongouserDetails";

export async function createCheckoutSession(
  defaultPrice: string
): Promise<void> {
  if (!defaultPrice) {
    throw new Error("Product name is required");
  }
  // get mongodb userid, useremail,
  const user = await getMongoUserDetails();
  if (!user) {
    window.location.href = "/sign-in";
    throw new Error("User not found");
  }

  // generate random string with prefix ram_
  const str = Math.random().toString(36).substring(2, 15);
  const fstr = "ram_" + str;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },
      automatic_tax: { enabled: true },
      billing_address_collection: "auto",
      client_reference_id: user._id.toString(),
      submit_type: "pay",
      customer_email: user.email,
      metadata: {
        mongouserID: user._id.toString(),
        user_name: user.name,
        rndm: fstr,
      },
      line_items: [
        {
          price: `${defaultPrice}`,
          quantity: 1,
        },
      ],
      payment_method_types: ["card", "link", "cashapp"],
      success_url: `${headers().get("origin")}/qagpt/`,
      cancel_url: `${headers().get("origin")}/purchase`,
      custom_text: {
        submit: {
          message:
            "By confirming, you allow QAGPT, LLC. to charge your card for this payment. All Purchases are final. Refunds Only required by Law. Please contact-us if you have any questions.",
        },
        terms_of_service_acceptance: {
          message: "I agree to the [Terms of Service](https://qagpt.co/terms)",
        },
      },
      consent_collection: {
        terms_of_service: "required",
      },
    });

  redirect(checkoutSession.url as string);
}

export async function getStripeProductsAndPrices() {
  const products = await stripe.products.list({ active: true });
  const productsWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const price = await stripe.prices.retrieve(
        product.default_price as string
      );
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        unit_amount: price.unit_amount,
        currency: price.currency,
        default_price: product.default_price,
      };
    })
  );
  return productsWithPrices;
}
