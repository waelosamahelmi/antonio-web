# Stripe Payment Integration - Deployment Guide

## Step 1: Install Supabase CLI (if not already installed)

```powershell
# Install via npm
npm install -g supabase

# Or via winget
winget install Supabase.CLI
```

## Step 2: Login to Supabase

```powershell
supabase login
```

## Step 3: Link Your Project

```powershell
cd babylon-web
supabase link --project-ref ssyhpqfdzbvrkvqdnxyy
```

## Step 4: Set Stripe Secret Keys in Supabase

You need to add your Stripe secret keys as Supabase secrets (NOT in .env file):

```powershell
# Set Stripe secret key (get from https://dashboard.stripe.com/apikeys)
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Set Stripe webhook secret (get from https://dashboard.stripe.com/webhooks after creating webhook)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 5: Deploy Edge Functions

```powershell
# Deploy the create-payment-intent function
supabase functions deploy create-payment-intent

# Deploy the stripe-webhook function
supabase functions deploy stripe-webhook
```

## Step 6: Add Stripe Publishable Key to .env

Add to your `babylon-web/.env` file:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Step 7: Test the Integration

1. Get test card from Stripe: https://stripe.com/docs/testing#cards
   - Card: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVC

2. Try placing an order with Apple Pay payment method
3. The payment form should appear
4. Complete the test payment

## Step 8: Set up Stripe Webhook (Optional - for production)

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://ssyhpqfdzbvrkvqdnxyy.supabase.co/functions/v1/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy the webhook signing secret
5. Update Supabase secret: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

## Troubleshooting

### CORS Error
If you get CORS errors, the function isn't deployed. Deploy it with:
```powershell
supabase functions deploy create-payment-intent
```

### "Stripe secret key not configured"
Set the secret with:
```powershell
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

### "Failed to send request to Edge Function"
1. Check if function is deployed: `supabase functions list`
2. Check function logs: `supabase functions logs create-payment-intent`
3. Verify project is linked: `supabase projects list`

## Quick Deploy Script

```powershell
cd babylon-web

# Deploy both functions
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook

# Verify deployment
supabase functions list
```

## Production Checklist

- [ ] Use live Stripe keys (pk_live_... and sk_live_...)
- [ ] Set up webhook endpoint
- [ ] Enable all required payment methods in Stripe Dashboard
- [ ] Test with real cards
- [ ] Monitor Stripe Dashboard for transactions
- [ ] Set up proper error tracking

## Test Cards

| Card Number         | Description              |
|---------------------|--------------------------|
| 4242 4242 4242 4242 | Visa - Success           |
| 4000 0025 0000 3155 | Visa - 3D Secure         |
| 4000 0000 0000 9995 | Visa - Decline           |
| 5555 5555 5555 4444 | Mastercard - Success     |

Use any future expiry date and any 3-digit CVC.

## Support

- Stripe Dashboard: https://dashboard.stripe.com
- Supabase Dashboard: https://app.supabase.com
- Stripe Docs: https://stripe.com/docs
