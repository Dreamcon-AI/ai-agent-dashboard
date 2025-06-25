const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// Credentials (keep these secure)
const CLIENT_ID = "45220429576-gfauopkqqjmhomo8jjrjcpek5k4rpjrh.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/callback";
const REFRESH_TOKEN = "1//06O1UJ65SM738CgYIARAAGAYSNwF-L9Irgqx4UmpxQL6U51OXKgMraeuki4IPLzmMcWSovVyDVLTnVzDJVHSSzvzFvQcEAteYK8c";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Hardcoded Zochert Fence calendar ID
const ZOCHERT_CALENDAR_ID = "blcto2tpkhisonlouirt5kql4c@group.calendar.google.com";

// Utility to get first and last day of current month
function getMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return {
    timeMin: req.query.timeMin,
timeMax: req.query.timeMax,
  };
}

// 🟢 Fetch Events
app.get("/api/calendar/events", async (req, res) => {
  try {
    const { timeMin, timeMax } = getMonthRange();
    const result = await calendar.events.list({
      calendarId: ZOCHERT_CALENDAR_ID,
      timeMin,
      timeMax,
      maxResults: 200,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.json(result.data.items);
  } catch (error) {
    console.error("❌ Error fetching events:", error.response?.data || error);
    res.status(500).send("Error fetching events");
  }
});

// 🟢 Create Event
app.post("/api/calendar/create", async (req, res) => {
  const { summary, description, start, end } = req.body;

  try {
    const event = {
      summary,
      description,
      start: { dateTime: new Date(start).toISOString() },
      end: { dateTime: new Date(end).toISOString() },
    };

    const result = await calendar.events.insert({
      calendarId: ZOCHERT_CALENDAR_ID,
      requestBody: event,
    });

    res.status(200).json(result.data);
  } catch (error) {
    console.error("❌ Error creating event:", error.response?.data || error);
    res.status(500).send("Error creating event");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Calendar proxy running at http://localhost:${PORT}`);
});

