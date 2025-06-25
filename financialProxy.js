const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const accessToken = "YeyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..9rX4z9fZaoc6S01v7Uu-2g.EUbhmmZMvHnjsUbqBMUL0s62tFLfhP4cIBQdsR2iy7B4mdiad8baJlFoRiJ1E4tb0A1J2s-4xz97vdRkZgib1-6PH4h9hYgpi2AMkfdF8NqhZZwzF4025FsJ_0iyGXjXvfO6DFbwv_aDMlQSbisACQoIa4Ofq6GExBGJojas-6Ntfvbkj5DyxMsEeoslSPIdg9a972MJfd7NNuKP5vGxtk7jQoQ2LqDnD2SvZr-BHs5c6v5F3lkMJe1JjBAMxzy5glkpFx7lpmChJc4FpHx2fAu1FD9Xvaf39CeAGSFKCBqHi_E76ql7UPwDyN-w8N6iXT-331ErPBZ5O08AZ7lXbZ8fvDIw00vFwwTRXMjByXiwXU--ycjbS9Gk_o7_vX3kEqduO0UilWAZFAr95PNXp0k3OWsLmcW_c94seqQDMQxUSDB3--AQ69UwvuAcghxMj4t1uNepiUmCpkrk94xU7v06U72ap4s-4m-vhhKTtms.S60wpMLent6Ftf-cTaNOiQ'"; // real token goes here
const realmId = "9341454878381146";

app.post("/api/fetch-unpaid-bills", async (req, res) => {
  console.log("📡 Fetching unpaid bills from QuickBooks...");

  const query = "SELECT * FROM Bill WHERE Balance > '0'";
  const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query`;

  try {
    const qboRes = await axios.post(url, query, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/text",
        Accept: "application/json",
      },
    });

    const bills = qboRes.data.QueryResponse.Bill || [];
    console.log(`✅ Retrieved ${bills.length} bills`);
    res.json(bills);
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error("❌ QuickBooks API Error:", detail);
    res.status(500).json({ error: "QBO API failed", detail });
  }
});

app.listen(4000, () => {
  console.log("🚀 Proxy server running at http://localhost:4000");
});

