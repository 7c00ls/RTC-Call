const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// Replace this with the actual filename of your service account JSON
const serviceAccount = require('./arsh-webrtc-firebase-adminsdk-fbsvc-0a88c1c4f0.json');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});


const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST route to send notification
app.post('/send', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) return res.status(400).send({ success: false, error: 'FCM token is required' });

  const message = {
    notification: {
      title: title || 'Notification Title',
      body: body || 'Notification Body'
    },
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    res.send({ success: true, response });
  } catch (error) {
    console.error("❌ Failed to send:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.send('🔔 FCM Notification Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
