

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
}));
app.use(express.json({ limit: '10mb' }));

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

/**
 * POST /api/send-email
 * Send a single email (order confirmation)
 *
 * Body:
 * {
 *   to: string,
 *   subject: string,
 *   html: string,
 *   replyTo?: string
 * }
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, replyTo } = req.body;

    // Validate input
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    console.log(`📧 Sending email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);

    // Send email
    const info = await transporter.sendMail({
      from: `"Ravintola Babylon" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo || 'info@ravintolababylon.fi'
    });

    console.log('✅ Email sent successfully:', info.messageId);

    res.json({
      success: true,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    });
  }
});

/**
 * POST /api/send-marketing-email
 * Send bulk emails (marketing campaigns)
 *
 * Body:
 * {
 *   recipients: string[], // Array of email addresses
 *   subject: string,
 *   htmlContent: string
 * }
 */
app.post('/api/send-marketing-email', async (req, res) => {
  try {
    const { recipients, subject, htmlContent } = req.body;

    // Validate input
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipients must be a non-empty array'
      });
    }

    if (!subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: subject, htmlContent'
      });
    }

    // Limit batch size to prevent abuse
    if (recipients.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 recipients per request'
      });
    }

    console.log(`📧 Sending marketing email to ${recipients.length} recipients`);
    console.log(`📧 Subject: ${subject}`);

    // Send emails with rate limiting (to avoid being marked as spam)
    const results = [];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const recipient of recipients) {
      try {
        const info = await transporter.sendMail({
          from: `"Ravintola Babylon" <${process.env.SMTP_USER}>`,
          to: recipient,
          subject: subject,
          html: htmlContent,
          replyTo: 'info@ravintolababylon.fi'
        });

        results.push({
          email: recipient,
          success: true,
          messageId: info.messageId
        });

        console.log(`✅ Email sent to ${recipient}`);

        // Add delay between emails (500ms)
        await delay(500);

      } catch (error) {
        console.error(`❌ Failed to send email to ${recipient}:`, error.message);
        results.push({
          email: recipient,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`✅ Marketing email campaign completed: ${successCount} sent, ${failCount} failed`);

    res.json({
      success: true,
      totalSent: successCount,
      totalFailed: failCount,
      results: results
    });

  } catch (error) {
    console.error('❌ Failed to send marketing emails:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send marketing emails'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Email API',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Email API server running on port ${PORT}`);
  console.log(`📧 SMTP configured for: ${process.env.SMTP_USER}`);
});

module.exports = app;
