require('dotenv').config(); // Loads .env file

// Now access variables like:
console.log(process.env.MONGODB_URI);



const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add to your .env:
// GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=your-client-secret
// GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

// Route to initiate Google OAuth
app.get('/api/auth/google', (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent' // Forces fresh token
  });
  res.redirect(url);
});

// Callback handler
app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);
    
    // 2. Get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email, sub: googleId } = ticket.getPayload();

    // 3. Find/Create user in DB
    const db = client.db('vizgo');
    let user = await db.collection('users').findOne({ email });
    
    if (!user) {
      user = await db.collection('users').insertOne({
        name,
        email,
        googleId,
        verified: true,
        createdAt: new Date()
      });
    }

    // 4. Create JWT for your app
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 5. Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});