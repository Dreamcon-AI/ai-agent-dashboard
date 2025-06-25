// File: backend/routes/scheduleConflictCheckRoute.js

import express from "express";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/check-conflicts", async (req, res) => {
  const { start, end, crew, equipment } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end date." });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "../google-calendar-service.json"),
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: "v3", auth: authClient });

    const response = await calendar.events.list({
      calendarId: "blcto2tpkhisonlouirt5kql4c@group.calendar.google.com",
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: "startTime",
    });

    const conflicts = [];
    const overlap = response.data.items || [];

    for (const event of overlap) {
      const desc = (event.description || "").toLowerCase();

      if (crew && desc.includes(crew.toLowerCase())) {
        conflicts.push({ type: "crew", event });
      }

      if (equipment && Array.isArray(equipment)) {
        for (const item of equipment) {
          if (desc.includes(item.toLowerCase())) {
            conflicts.push({ type: "equipment", item, event });
          }
        }
      }
    }

    if (conflicts.length > 0) {
      return res.json({ ok: false, conflicts });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Conflict check failed:", err);
    res.status(500).json({ error: "Conflict check error", detail: err.message });
  }
});

export default router;
