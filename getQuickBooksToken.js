const axios = require("axios");
const qs = require("qs");

// Paste your real values here:
const clientId = "ABIziMX3ch79YQAcS5U63X8iJCBOfQPGlEwIXgdyaBqFdib6HR";
const clientSecret = "58cPDZZmW90BUsvOUE3edGOPcU2urznlbWhyIHUK";
const redirectUri = "http://localhost:3000/callback";
const authCode = "XAB11750370067g24E9CONBLJozTi66xlVSEsw2Eax8UoVfVgE";

const tokenUrl = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

axios
  .post(
    tokenUrl,
    qs.stringify({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUri,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
    }
  )
  .then((response) => {
    console.log("✅ Access Token Response:");
    console.log(response.data);
  })
  .catch((error) => {
    console.error("❌ Token exchange failed:");
    console.dir(error.response?.data || error);
  });


