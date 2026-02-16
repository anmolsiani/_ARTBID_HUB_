import Stripe from 'stripe';
export declare const stripe: Stripe;
export declare const createPaymentIntent: (amount: number, metadata: Record<string, string>) => Promise<Stripe.PaymentIntent>;
export declare const createCheckoutSession: (lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], metadata: Record<string, string>, successUrl: string, cancelUrl: string) => Promise<Stripe.Checkout.Session>;
//# sourceMappingURL=stripe.d.ts.map