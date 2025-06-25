// File: backend/getGoogleCalendarToken.js

import axios from "axios";
import qs from "qs";

// Permanent credentials
const clientId = "XXXXXXXXX";
const clientSecret = "XXXXXXXXX";
const refreshToken = "XXXXXXX";

export async function getGoogleCalendarToken() {
  const tokenUrl = "https://oauth2.googleapis.com/token";

  const requestData = qs.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  try {
    const res = await axios.post(tokenUrl, requestData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data.access_token;
  } catch (err) {
    console.error("❌ Failed to refresh Google token:", err.response?.data || err);
    throw new Error("Google token refresh failed");
  }
}

