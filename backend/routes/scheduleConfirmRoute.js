// File: backend/routes/scheduleConfirmRoute.js

import express from "express";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/confirm", async (req, res) => {
  try {
    const event = req.body;
    if (!event || !event.summary || !event["start.dateTime"]) {
      return res.status(400).json({ error: "Invalid event format." });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "../google-calendar-service.json"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.events.insert({
      calendarId: "blcto2tpkhisonlouirt5kql4c@group.calendar.google.com",
      requestBody: event,
    });

    res.json({ success: true, eventId: response.data.id });
  } catch (err) {
    console.error("❌ Event confirmation failed:", err);
    res.status(500).json({ error: "Failed to confirm event", detail: err.message });
  }
});

export default router;
