# Babylon Email API Service

Backend API service for handling email sending via Hostinger SMTP for Ravintola Babylon.

## Features

- ✅ Order confirmation emails
- ✅ Marketing campaign emails
- ✅ Secure SMTP configuration
- ✅ Rate limiting for bulk sends
- ✅ CORS protection
- ✅ HTML email templates

## Setup Instructions

### 1. Install Dependencies

```bash
cd api-example
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Hostinger SMTP credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=no-reply@ravintolababylon.fi
SMTP_PASS=your-actual-password-here
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### 3. Get Your Hostinger SMTP Password

1. Log in to your Hostinger control panel
2. Go to **Email Accounts**
3. Find `no-reply@ravintolababylon.fi`
4. Set/reset the password
5. Use this password in your `.env` file

### 4. Run the API

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will start on `http://localhost:3001`

### 5. Update Frontend Configuration

In your babylon-web project, update the email service to call this API:

```typescript
// In src/lib/email-service.ts
const API_URL = 'http://localhost:3001'; // or your production URL

export async function sendOrderConfirmationEmail(data: OrderEmailData, language: 'fi' | 'en' = 'fi') {
  const htmlContent = generateOrderConfirmationHTML(data, language);

  const response = await fetch(`${API_URL}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: data.customerEmail,
      subject: language === 'fi'
        ? `Tilausvahvistus - ${data.orderNumber}`
        : `Order Confirmation - ${data.orderNumber}`,
      html: htmlContent
    })
  });

  return response.json();
}
```

## API Endpoints

### POST /api/send-email

Send a single email (e.g., order confirmation).

**Request Body:**
```json
{
  "to": "customer@example.com",
  "subject": "Tilausvahvistus - #12345",
  "html": "<html>...</html>",
  "replyTo": "info@ravintolababylon.fi"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "<message-id>"
}
```

### POST /api/send-marketing-email

Send bulk marketing emails to multiple recipients.

**Request Body:**
```json
{
  "recipients": ["customer1@example.com", "customer2@example.com"],
  "subject": "Erikoistarjous viikonlopuksi!",
  "htmlContent": "<html>...</html>"
}
```

**Response:**
```json
{
  "success": true,
  "totalSent": 50,
  "totalFailed": 0,
  "results": [
    { "email": "customer1@example.com", "success": true, "messageId": "..." },
    { "email": "customer2@example.com", "success": true, "messageId": "..." }
  ]
}
```

**Limitations:**
- Maximum 100 recipients per request
- 500ms delay between emails (rate limiting)

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "Email API",
  "timestamp": "2025-01-21T12:00:00.000Z"
}
```

## Deployment Options

### Option 1: Deploy to Same Server as Frontend

1. Build and deploy this API to your web server
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start email-endpoint.js --name babylon-email-api
   pm2 save
   pm2 startup
   ```

### Option 2: Deploy as Serverless Function

Convert to serverless function for platforms like:
- Vercel Serverless Functions
- AWS Lambda
- Google Cloud Functions
- Azure Functions

### Option 3: Use Docker

Create a Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "email-endpoint.js"]
```

Build and run:
```bash
docker build -t babylon-email-api .
docker run -p 3001:3001 --env-file .env babylon-email-api
```

## Testing

Test the email endpoint:

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello World</h1>"
  }'
```

## Security Considerations

1. **Never expose SMTP credentials** in frontend code
2. **Use HTTPS** in production
3. **Implement rate limiting** to prevent abuse
4. **Validate email addresses** before sending
5. **Use environment variables** for sensitive data
6. **Restrict CORS origins** to your domains only
7. **Add authentication** if exposing publicly

## Troubleshooting

### Connection Issues

If you get "ECONNECTION" errors:
- Check SMTP credentials are correct
- Verify Hostinger email account is active
- Try port 465 with `secure: true` if 587 doesn't work
- Check firewall rules allow outbound SMTP

### Authentication Errors

- Double-check email and password
- Make sure you're using the full email address as username
- Try resetting the password in Hostinger

### Emails Going to Spam

- Add SPF, DKIM, and DMARC records in DNS
- Use consistent "From" name and address
- Avoid spam trigger words
- Include unsubscribe link in marketing emails

## Support

For issues or questions:
- Email: info@ravintolababylon.fi
- Phone: +358 3 589 9089
