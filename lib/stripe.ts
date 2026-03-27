import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const PLANS = {
  essentiel: {
    name: "Essentiel",
    priceId: process.env.STRIPE_PRICE_ESSENTIEL!,
    price: 99,
  },
  pro: {
    name: "Professionnel",
    priceId: process.env.STRIPE_PRICE_PRO!,
    price: 149,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
