const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Supabase client on the backend (securely holding the service role or anon keys)
const supabaseUrl = process.env.SUPABASE_URL || 'https://ihjchrkjhlejofdjiams.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_SaJDLxtk7doLlBMD5tHwyg_FTVp3Qbp';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '246759667299-eiocjbu5p9cfqk0osv840tvbvqrivajs.apps.googleusercontent.com';

const supabase = createClient(supabaseUrl, supabaseKey);
const googleClient = new OAuth2Client(googleClientId);

console.log(`[F3 BACKEND] Supabase URL: ${supabaseUrl}`);
console.log(`[F3 BACKEND] Google Client ID: ${googleClientId}`);

// 1. GET PUBLIC CONFIGURATIONS
app.get('/api/config', (req, res) => {
  res.json({
    googleClientId: googleClientId,
    supabaseUrl: supabaseUrl
  });
});

// 2. POST OUTBOUND OTP DISPATCH (Email / Phone)
app.post('/api/auth/send-otp', async (req, res) => {
  const { type, value } = req.body;
  if (!value) {
    return res.status(400).json({ success: false, error: 'Recipient address/number is required' });
  }

  try {
    let result;
    if (type === 'email') {
      result = await supabase.auth.signInWithOtp({
        email: value,
        options: { shouldCreateUser: true }
      });
    } else {
      result = await supabase.auth.signInWithOtp({
        phone: value,
        options: { shouldCreateUser: true }
      });
    }

    if (result.error) {
      throw result.error;
    }

    res.json({ success: true, message: `OTP sent successfully to ${value}` });
  } catch (err) {
    console.error(`[F3 BACKEND] OTP Send Error to ${value}:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST INBOUND OTP VERIFICATION
app.post('/api/auth/verify-otp', async (req, res) => {
  const { type, value, token } = req.body;
  if (!value || !token) {
    return res.status(400).json({ success: false, error: 'Recipient identifier and token code are required' });
  }

  try {
    let result;
    if (type === 'email') {
      result = await supabase.auth.verifyOtp({
        email: value,
        token: token,
        type: 'signup'
      });
      // Alternate verification type fallback
      if (result.error) {
        result = await supabase.auth.verifyOtp({
          email: value,
          token: token,
          type: 'email'
        });
      }
    } else {
      result = await supabase.auth.verifyOtp({
        phone: value,
        token: token,
        type: 'sms'
      });
    }

    if (result.error) {
      throw result.error;
    }

    const sessionUser = result.data.user;
    if (!sessionUser) {
      return res.status(401).json({ success: false, error: 'No user session established' });
    }

    res.json({
      success: true,
      user: {
        name: sessionUser.email ? sessionUser.email.split('@')[0] : `User ${sessionUser.phone.slice(-4)}`,
        email: sessionUser.email || '',
        phone: sessionUser.phone || '',
        avatar: sessionUser.email ? sessionUser.email[0].toUpperCase() : '📱',
        method: 'Supabase Real OTP'
      }
    });
  } catch (err) {
    console.error(`[F3 BACKEND] OTP Verification failure for ${value}:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST GOOGLE IDENTITY SERVICES CREDENTIAL VERIFICATION
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: 'Google JWT ID token is required' });
  }

  try {
    // Verify the Google ID token with Google's public keys
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: googleClientId
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid token payload' });
    }

    res.json({
      success: true,
      user: {
        name: payload.name || 'Google User',
        email: payload.email || '',
        avatar: payload.picture || (payload.name ? payload.name[0] : 'G'),
        method: 'Google Verified Backend'
      }
    });
  } catch (err) {
    console.error('[F3 BACKEND] Google verification error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// For any other routes, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export for Vercel serverless functions
module.exports = app;

// Launch Server only in local development (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[F3 SERVER] Backend running at http://localhost:${PORT}`);
  });
}
