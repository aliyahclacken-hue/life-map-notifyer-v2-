const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Firebase Admin setup (no serviceAccountKey.json needed)

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

// Send push notification

async function sendPush(token, message) {
  try {
    await admin.messaging().send({
      token: token,
      notification: {
        title: "LifeMap Alert",
        body: message
      }
    });
  } catch (err) {
    console.log("Push error:", err);
  }
}

// Watch Firestore changes

db.collection("users").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "modified") {
      const data = change.doc.data();

      if (!data.fcmToken) return;

      const message =
        data.name + " is " + data.movement + " at " + data.location;

      sendPush(data.fcmToken, message);
    }
  });
});

// Simple test route

app.get("/", (req, res) => {
  res.send("LifeMap notifier running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
