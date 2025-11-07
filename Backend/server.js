const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// fixed the private key formatting
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: privateKey,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

console.log('Initializing Firebase with:', {
  projectId: serviceAccount.projectId,
  clientEmail: serviceAccount.clientEmail,
  keyStart: privateKey.substring(0, 50) + '...'
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.post('/send-notification', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Received userId:', userId);

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { expoPushToken } = userDoc.data();
    console.log('Found token:', expoPushToken);

    const response = await axios.post('https://exp.host/--/api/v2/push/send', {
      to: expoPushToken,
      title: 'Test Notification',
      body: 'You got a notification!',
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
      },
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
