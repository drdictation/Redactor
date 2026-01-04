import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Product configuration - maps productId to Stripe Price ID
const PRODUCT_PRICES: Record<string, string | undefined> = {
    'redactor': process.env.STRIPE_PRICE_ID,           // $5 - Redactor unlock
    'audit_report_29': process.env.STRIPE_AUDITOR_PRICE_ID,  // $29 - Auditor report
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { productId } = req.body;

        // Get the price ID for the requested product
        const priceId = PRODUCT_PRICES[productId] || PRODUCT_PRICES['redactor'];

        if (!priceId) {
            return res.status(400).json({ error: 'Invalid product or missing price configuration' });
        }

        // Determine success URL based on product
        const successPath = productId === 'audit_report_29' ? '/auditor' : '/';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}${successPath}?session_id={CHECKOUT_SESSION_ID}&product=${productId}`,
            cancel_url: `${req.headers.origin}${successPath}`,
        });

        return res.status(200).json({ url: session.url });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}
