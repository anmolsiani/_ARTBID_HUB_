"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.createPaymentIntent = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
}
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const createPaymentIntent = async (amount, metadata) => {
    try {
        const paymentIntent = await exports.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    }
    catch (error) {
        console.error('Stripe payment intent error:', error);
        throw new Error('Failed to create payment intent');
    }
};
exports.createPaymentIntent = createPaymentIntent;
const createCheckoutSession = async (lineItems, metadata, successUrl, cancelUrl) => {
    try {
        const session = await exports.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata,
        });
        return session;
    }
    catch (error) {
        console.error('Stripe checkout session error:', error);
        throw new Error('Failed to create checkout session');
    }
};
exports.createCheckoutSession = createCheckoutSession;
//# sourceMappingURL=stripe.js.map