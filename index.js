const express = require("express");
const { google } = require("google-auth-library");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const app = express();
app.use(express.json());

// Load service account key
const serviceAccount = require("./service-account.json");

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];
const PROJECT_ID = serviceAccount.project_id;

async function getAccessToken() {
  const client = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: SCOPES,
  });

  const token = await client.authorize();
  return token.access_token;
}

app.post("/send-notification", async (req, res) => {
  const { token, roomId, fromName } = req.body;

  if (!token || !roomId || !fromName) {
    return res.status(400).send("Missing fields: token, roomId, fromName");
  }

  const message = {
    message: {
      token,
      notification: {
        title: `Incoming Call from ${fromName}`,
        body: `Room ID: ${roomId}`
      },
      data: {
        roomId
      },
      webpush: {
        notification: {
          actions: [
            { action: "accept", title: "Accept Call" },
            { action: "reject", title: "Reject Call" }
          ]
        }
      }
    }
  };

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(
      \`https://fcm.googleapis.com/v1/projects/\${PROJECT_ID}/messages:send\`,
      {
        method: "POST",
        headers: {
          "Authorization": \`Bearer \${accessToken}\`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      }
    );

    const result = await response.json();
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ HTTP v1 FCM push server running on port 3000");
});
