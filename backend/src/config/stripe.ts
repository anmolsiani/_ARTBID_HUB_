import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (
    amount: number,
    metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent;
    } catch (error) {
        console.error('Stripe payment intent error:', error);
        throw new Error('Failed to create payment intent');
    }
};

export const createCheckoutSession = async (
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    metadata: Record<string, string>,
    successUrl: string,
    cancelUrl: string
): Promise<Stripe.Checkout.Session> => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata,
        });

        return session;
    } catch (error) {
        console.error('Stripe checkout session error:', error);
        throw new Error('Failed to create checkout session');
    }
};
