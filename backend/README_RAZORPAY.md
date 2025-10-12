# Razorpay setup (backend)

This project uses Razorpay for processing one-time course payments. Follow these steps to configure and test locally.

1. Create a `.env` file in the `backend/` folder (you can copy `.env.example`).

2. Get Razorpay test keys:

   - Sign up / log in to Razorpay Dashboard
   - Go to Settings -> API Keys and create test keys
   - Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your `.env`

3. (Optional) For webhook testing, set `RAZORPAY_WEBHOOK_SECRET` in `.env` and configure the webhook URL in the Razorpay dashboard. For local dev, use a tunnel (ngrok) and paste the ngrok URL into the webhook settings.

4. Start the backend:

```powershell
$env:PORT = 3001
npm start
```

5. On the frontend, ensure the checkout uses these test keys returned by the backend. After a successful checkout, the frontend calls `verify-payment` which uses `RAZORPAY_KEY_SECRET` to verify the signature.

Troubleshooting

- If you see `Razorpay keys not configured` in responses, verify your `.env` contains `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` and that the backend process was restarted after editing `.env`.
- For webhook signature mismatches, ensure `RAZORPAY_WEBHOOK_SECRET` matches exactly the secret set in the Razorpay dashboard.
  Razorpay integration (local setup)

1. Install dependency in backend:

   npm install razorpay

2. Environment variables (create a .env in backend/):

   RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_optional

3. To test webhooks locally, run ngrok and configure the webhook URL in Razorpay dashboard. Example:

   ngrok http 3001

   Set webhook in Razorpay to: https://<your-ngrok>.ngrok.io/api/webhook/razorpay

4. Endpoints added:

   POST /api/course/:id/create-order -> create an order (auth required)
   POST /api/course/:id/verify-payment -> verify payment after checkout (auth required)
   POST /api/webhook/razorpay -> optional webhook endpoint (no auth)

Note: Do not commit API keys. Use test keys for development.
