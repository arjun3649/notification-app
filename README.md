# Expo Push Notification Integration

**Assignment:** Expo Push Notification Integration with Firestore and Node.js

A full-stack demonstration of push notifications using Expo (React Native), Firebase Cloud Messaging (FCM), Firestore, and a Node.js backend server.

---

## 📋 Project Objective

Build a demo Expo app that demonstrates **end-to-end notification functionality** using:
- Firebase Cloud Messaging (FCM)
- Firestore as database
- Node.js server to trigger notifications

---

## ✅ Assignment Requirements Met

### ✓ Frontend (Expo App)
- [x] New Expo React Native app created
- [x] Expo Notifications integrated
- [x] User notification permissions requested on start
- [x] Expo push token stored in Firestore
- [x] "Send Test Notification" button implemented
- [x] Calls Node.js backend endpoint

### ✓ Backend (Node.js Server)
- [x] Express.js server with `/send-notification` endpoint
- [x] Fetches user push token from Firestore using Firebase Admin SDK
- [x] Sends notification via Expo Push API
- [x] Returns JSON response (success/failure)
- [x] Endpoint documentation with cURL examples

### ✓ Database (Firestore)
- [x] Stores user information and push tokens
- [x] Consistent data structure with timestamps
- [x] Collection: `users`
- [x] Fields: `name`, `userId`, `expoPushToken`, `createdAt`

### ✓ Technical Expectations
- [x] Firebase Admin SDK on Node.js
- [x] dotenv for environment variables
- [x] async/await with error handling
- [x] Modular and readable code
- [x] Works in Expo Go (dev) and built APK

---


---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase project with Firestore
- iOS/Android device with Expo Go app
- GitHub account (for deployment)

### Step 1: Frontend Setup
```bash
cd my-notification-app/Frontend
npm install
```
### Step 2: Environment Configuration
- All environment variables are  stored inside app.json → extra, like this:
```bash
"extra": {
  "eas": {
    "projectId": "YOUR_EAS_PROJECT_ID"
  },
  "EXPO_PUBLIC_FIREBASE_API_KEY": "YOUR_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "YOUR_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "YOUR_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "YOUR_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID": "YOUR_FIREBASE_APP_ID",
  "EXPO_PUBLIC_EXPO_PROJECT_ID": "YOUR_EXPO_PROJECT_ID",
  "EXPO_PUBLIC_BACKEND_URL": "YOUR_BACKEND_URL"
}


```
- In the frontend code, these values are accessed using:
  ```bash
  import Constants from 'expo-constants';
  ```
  ```bash
  const BACKEND_URL = Constants.expoConfig.extra.EXPO_PUBLIC_BACKEND_URL;
  ```
### Step 3: Start the app
```bash
npx expo start --dev-client
or
npx expo start  -> press s to access expo go mode
```
## Backend Setup
```bash
cd my-notification-app/Backend
npm install
```
### Create .env file
```bash
FIREBASE_PROJECT_ID=PROJECT_ID
FIREBASE_PRIVATE_KEY=PRIVATE_KEY
EXPO_ACCESS_TOKEN=ACCESS_TOKEN
PORT=3000
```
### Start the Backend
```bash
node server.js
```
## Firebase Setup
###  Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. **Settings** → **Service Accounts** → **Generate New Private Key**
4. Copy `private_key` and `client_email` to backend `.env`

---

###  Get Expo Access Token

1. Visit [Expo Dashboard](https://expo.dev/settings/access-tokens)
2. **Create Token**
3. Copy to backend `.env` as `EXPO_ACCESS_TOKEN`

---
## 📸 Firestore Database Screenshot

The user data is successfully stored in Firestore with the following structure:

**Collection:** `users`
**Document ID:** `19c0d44a-fa2d-4692-8e60-866d943f0ad3` (userId)

**Fields:**
- `createdAt`: November 8, 2025 at 6:18:31 AM UTC+5:30 (timestamp)
- `expoPushToken`: "ExponentPushToken[A1P8jqHApnssTpzZaVlK_E]" (string)
- `name`: "Notification User" (string)
- `userId`: "19c0d44a-fa2d-4692-8e60-866d943f0ad3" (string)

<img width="1889" height="920" alt="image" src="https://github.com/user-attachments/assets/daa92ef9-a055-4377-87f6-47fe95eabbe0" />


## 🔌 API Endpoint Documentation

### POST /send-notification

Sends a push notification to a user.

**Request:**
Method: POST
URL: http://10.95.112.214:3000/send-notification
Content-Type: application/json
**Request Body:**
{
"userId": "19c0d44a-fa2d-4692-8e60-866d943f0ad3"
}

**Success Response (200):**
{
"success": true,
"data": {
"id": "ExponentPushTicket[...]",
"status": "ok"
}
}

**Error Response (404):**
{
"error": "User not found in Firestore"
}



---

### Testing with Postman

1. **Create new request**
   - Method: `POST`
   - URL: `http://10.95.112.214:3000/send-notification`

2. **Headers tab**
   - Key: `Content-Type`
   - Value: `application/json`

3. **Body tab** (select "raw" and "JSON")
{
"userId": "19c0d44a-fa2d-4692-8e60-866d943f0ad3"
}



4. **Click Send**

---
### On Production/Build
- 🌐 Ngrok Setup (Backend Tunneling)
#### install ngrok
```bash
npm install -g ngrok

```
#### Authenticate Ngrok

-Ngrok requires an authentication token linked to your account.

-Sign up or log in to ngrok.com. Copy your Auth Token from the dashboard.

-Run this command in your terminal:
```bash

ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN
```
#### 1️⃣ Start the Node.js Server

In your Backend directory, start the Express server:
```bash
node server.js
```
#### 2️⃣ Expose Localhost via Ngrok

Run this command to expose your backend (port 3000):
```bash
npx ngrok http 3000
```
You’ll see output like this:
```bash 
Forwarding  https://abcd1234.ngrok-free.app -> http://localhost:3000
```


#### 3️⃣ Update Frontend Config

Copy the generated HTTPS URL and paste it into your frontend app.json → extra section:
```bash 

"EXPO_PUBLIC_BACKEND_URL": "https://abcd1234.ngrok-free.app"
```


This allows your Expo app (running on a physical device or emulator) to make network requests to your locally running backend.

#### 4️⃣ Verify the Tunnel

Open the following URL in your browser:
```bash 
https://abcd1234.ngrok-free.app/
```
If it shows:
```bash
Cannot GET /
```
✅ That’s expected — it confirms your backend is live and publicly accessible through Ngrok.



 


