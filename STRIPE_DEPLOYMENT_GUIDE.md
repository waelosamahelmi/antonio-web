# Stripe Integration Deployment Guide

## Current Issue
The Stripe payment is failing because the **Supabase Edge Functions are not deployed yet**.

## Quick Fix Options

### Option 1: Deploy Supabase Edge Functions (Recommended for Production)

1. **Install Supabase CLI**:
```bash
npm install -g supabase
```

2. **Login to Supabase**:
```bash
supabase login
```

3. **Link your project**:
```bash
cd babylon-web
supabase link --project-ref ssyhpqfdzbvrkvqdnxyy
```

4. **Set Stripe secrets** (Get keys from https://dashboard.stripe.com/apikeys):
```bash
# For testing, use test keys (pk_test_... and sk_test_...)
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key_here
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

5. **Deploy the Edge Functions**:
```bash
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
```

6. **Verify deployment**:
```bash
supabase functions list
```

### Option 2: Use Server-Side API Route (Quick Testing)

If you want to test immediately without deploying Edge Functions, you can create a simple Express/Node.js endpoint.

#### Create a simple server (for testing only):

Create `babylon-web/server/stripe-api.js`:
```javascript
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = new Stripe('sk_test_your_stripe_secret_key_here');

app.use(cors());
app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {},
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Stripe API server running on http://localhost:3001');
});
```

Then update `stripe-api.ts` to use this endpoint:
```typescript
const response = await fetch('http://localhost:3001/api/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: Math.round(params.amount * 100),
    currency: params.currency || 'eur',
    metadata: params.metadata || {},
  }),
});
```

### Option 3: Disable Stripe Temporarily (Fastest for Testing)

If you just want to test the rest of the app without Stripe:

1. Set all Stripe payment methods to `enabled: false` in restaurant_settings
2. Only use Cash and Card payment methods

## Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add to babylon-web/.env:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Testing with Stripe Test Cards

Once deployed, test with these cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Troubleshooting

### Error: "Failed to create payment intent"
- ✅ Check Edge Functions are deployed: `supabase functions list`
- ✅ Verify secrets are set: `supabase secrets list`
- ✅ Check function logs: `supabase functions logs create-payment-intent`

### Error: "Stripe publishable key not configured"
- ✅ Add VITE_STRIPE_PUBLISHABLE_KEY to .env
- ✅ Restart dev server: `npm run dev`

### Error: "No such payment method type"
- ✅ Use automatic_payment_methods instead of specific types
- ✅ Edge function has been updated to handle this correctly

## Next Steps

1. Choose which option above you want to use
2. For production, use Option 1 (Supabase Edge Functions)
3. For quick local testing, use Option 2 (local server)
4. Update the database to add stripe_publishable_key to restaurant_settings
