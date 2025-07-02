# HTTP v1 FCM Push Notification Backend (Node.js)

This Node.js backend sends Firebase Cloud Messaging (FCM) push notifications using HTTP v1 API and a service account key.

## 🧩 Requirements
- Firebase project
- Downloaded service account JSON key

## 📁 Setup
1. Place your service account JSON as:
   `service-account.json` in the same folder.

2. Install dependencies:
   npm install

3. Run the server:
   npm start

## 📡 API Endpoint

POST /send-notification

Body JSON:
{
  "token": "<user_device_fcm_token>",
  "roomId": "12345",
  "fromName": "Arshad"
}

## ✅ Output
Push notification is sent using HTTP v1 with OAuth2 bearer token.
