const express = require("express");

const cors = require("cors");

const fetch = require("node-fetch");

const app = express();

app.use(cors());

app.use(express.json());

const PROJECT_ID = "life360-style-app";

const SERVER_KEY = process.env.FIREBASE_SERVER_KEY;

async function sendPush(token, message) {

  try {

    const res = await fetch(

      `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${SERVER_KEY}`

        },

        body: JSON.stringify({

          message: {

            token: token,

            notification: {

              title: "LifeMap Alert",

              body: message

            }

          }

        })

      }

    );

    const data = await res.json();

    console.log("FCM response:", data);

  } catch (err) {

    console.log("Push error:", err);

  }

}

app.post("/notify", async (req, res) => {

  const { token, message } = req.body;

  if (!token || !message) {

    return res.status(400).send("Missing token or message");

  }

  await sendPush(token, message);

  res.send("Notification sent");

});

app.get("/", (req, res) => {

  res.send("LifeMap notifier running");

});

app.listen(3000, () => {

  console.log("Server running on port 3000");

});
