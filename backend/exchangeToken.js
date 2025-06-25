// File: backend/exchangeToken.js
import axios from "axios";
import qs from "qs";

const clientId = "880012066839-2k4kndpmg7adakcqc4sva9u2n2m29v46.apps.googleusercontent.com";
const clientSecret = "XXXXXXXXXXXX";
const redirectUri = "http://localhost:3000/google-callback";
const authCode = "4/0AUJR-x6CTWtCjqM0pPaUC737iY7FV5q-2FZSguHDY-1qIeZC0bER28YoQKSDvCipepylfg";

const tokenUrl = "https://oauth2.googleapis.com/token";

const requestData = qs.stringify({
  code: authCode,
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  grant_type: "authorization_code",
});

axios
  .post(tokenUrl, requestData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  .then((res) => {
    console.log("✅ Google Calendar Access Token + Refresh Token:");
    console.log(res.data); // <-- SAVE THE REFRESH TOKEN
  })
  .catch((err) => {
    console.error("❌ Token exchange failed:");
    console.dir(err.response?.data || err);
  });
