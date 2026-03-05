# 🔐 Stripe Setup Guide for Fund Me Feature

## Overview
This guide will help you set up Stripe payment integration for your Fund Me page.

## Prerequisites
- Stripe account (free to create)
- Access to your project's `.env.local` file

## Step-by-Step Setup

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up" and create your account
3. Verify your email address

### 2. Get Your Stripe API Keys

#### For Testing (Development)
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test Mode** (toggle in the top right)
3. Go to **Developers** → **API keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

#### For Production (Live Payments)
1. Complete your Stripe account activation:
   - Add business details
   - Verify your identity
   - Connect bank account for payouts
2. Switch to **Live Mode** (toggle in the top right)
3. Go to **Developers** → **API keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`) - Click "Reveal live key"

### 3. Add Keys to Your Project

Open `.env.local` file in your project root and update:

```env
# Stripe Configuration - TEST KEYS (for development)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

**For production deployment:**
```env
# Stripe Configuration - LIVE KEYS (for production)
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
```

⚠️ **IMPORTANT:**
- Never commit your `.env.local` file to Git
- Never share your secret keys publicly
- Use test keys during development
- Switch to live keys only when ready for production

### 4. Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3004/fund-me](http://localhost:3004/fund-me)

3. Select a donation option and click "Proceed to Payment"

4. Use Stripe's test card numbers:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **Requires Auth:** `4000 0025 0000 3155`
   - **Expiry:** Any future date (e.g., 12/34)
   - **CVC:** Any 3 digits (e.g., 123)
   - **ZIP:** Any ZIP code

5. Complete the test payment and verify you're redirected to the success page

### 5. Configure Stripe Settings (Optional but Recommended)

#### A. Set up Webhooks (for tracking payments)
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

#### B. Customize Checkout Experience
1. Go to **Settings** → **Branding**
2. Upload your logo
3. Set brand colors
4. This will be reflected in the Stripe Checkout page

#### C. Set up Email Receipts
1. Go to **Settings** → **Emails**
2. Customize receipt emails
3. Add your business information

### 6. Currency Settings

The Fund Me page is currently configured for **AUD (Australian Dollar)**.

To change the currency:
1. Open `src/app/api/create-checkout/route.ts`
2. Find line with `currency: 'aud'`
3. Change to your preferred currency:
   - `'usd'` for US Dollar
   - `'eur'` for Euro
   - `'gbp'` for British Pound
   - [See all supported currencies](https://stripe.com/docs/currencies)

### 7. Going Live

Before accepting real payments:

1. **Complete Stripe account activation:**
   - ✅ Verify business details
   - ✅ Add bank account for payouts
   - ✅ Verify identity documents

2. **Switch to Live Mode:**
   - Update `.env.local` with live keys
   - Test thoroughly with test cards first
   - Deploy to production

3. **Set Production Environment Variables:**
   If using Vercel/Netlify:
   - Go to project settings
   - Add environment variables:
     - `STRIPE_SECRET_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_WEBHOOK_SECRET` (if using webhooks)

4. **Test in Production:**
   - Use test cards in live mode (Stripe allows this)
   - Verify success/cancel flows work
   - Check email receipts are sent

### 8. Monitor Payments

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. View payments in **Payments** section
3. Track successful/failed transactions
4. Download reports for accounting

## Troubleshooting

### "Stripe is not configured" error
- Check that `.env.local` has the correct keys
- Restart your dev server after adding keys
- Ensure keys don't have extra spaces or quotes

### Payment not redirecting after success
- Check `NEXT_PUBLIC_SITE_URL` in `.env.local`
- Verify success URL in Stripe Checkout session

### Webhook not working
- Verify webhook URL is publicly accessible
- Check webhook signing secret is correct
- View webhook logs in Stripe Dashboard

## Security Best Practices

1. ✅ Never expose secret keys in client-side code
2. ✅ Always validate amounts on the server
3. ✅ Use environment variables for all sensitive data
4. ✅ Enable webhook signature verification
5. ✅ Set up fraud detection rules in Stripe Dashboard
6. ✅ Monitor transactions regularly

## Support

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** Available in your dashboard
- **Community:** [Stripe Discord](https://discord.gg/stripe)

## What You Need From Claude

To set up Stripe, I need you to provide:

1. **Stripe Test Keys** (for development):
   - Test Secret Key (starts with `sk_test_`)
   - Test Publishable Key (starts with `pk_test_`)

2. **Stripe Live Keys** (when ready for production):
   - Live Secret Key (starts with `sk_live_`)
   - Live Publishable Key (starts with `pk_live_`)

Once you provide these, update them in your `.env.local` file and the Fund Me feature will be fully functional!

---

**Current Status:**
✅ Fund Me page created with 8 fun donation options
✅ Custom amount support
✅ Message/chat box for supporters
✅ Stripe integration code ready
⏳ Waiting for Stripe API keys to test payments

**Next Steps:**
1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys
3. Add them to `.env.local`
4. Test with card `4242 4242 4242 4242`
5. Deploy and enjoy! 🚀