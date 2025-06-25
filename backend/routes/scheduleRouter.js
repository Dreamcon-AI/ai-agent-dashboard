// File: backend/routes/scheduleRouter.js

import express from "express";
import { google } from "googleapis";
import { parseTextToEvent } from "../ai/parseEventAI.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Required to construct absolute path to service key
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/create", async (req, res) => {
  try {
    const { inputText } = req.body;
    if (!inputText) return res.status(400).json({ error: "Missing inputText" });

    const parsedEvent = await parseTextToEvent(inputText);

    // Authenticate with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "../google-calendar-service.json"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.events.insert({
      calendarId: "blcto2tpkhisonlouirt5kql4c@group.calendar.google.com",
      requestBody: parsedEvent,
    });

    res.json({ success: true, event: response.data });console.log("✅ Event created:", response.data);

  } catch (err) {
    console.error("Event creation failed:", err);
    res.status(500).json({ error: "Failed to create event", detail: err.message });
  }
});

export default router;
