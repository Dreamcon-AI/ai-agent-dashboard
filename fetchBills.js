const axios = require("axios");

const accessToken = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwieC5vcmciOiJIMCJ9..tYngqwn4m-gufO_Ala0FFA.iwpzWw-bc-hfiOEs5xw44lrwnEnQZue191U1LWuvbJSmS3RvtidDnkVe0VZ7DnF0ndhrcY5edkB9JjBw6PA2yVkeDXN4IvJuHjaUpM3qVydE4fqAwlC5r56FT1rSk46DLe6J4CZ_JkVlUz3buYe2yh6SRJAYSO7NMkRXKVurEuKhkGPStFXsdHFTqRy1BhsOPE-1hSIXqcoNyZubdOERRLCA1TPmthUEsbI8Qu6OvNcrbaLWOoXQvptTgTxl9WMKKmG2ivVOvevb9_zQ8b7tPHeIs0yda34W7V-7vpyvHWHfC3VPkenuEtlJJUg-V-753xVO0tEbs9bueJ5GxrpPXcmSdEp6rXeKmaGLnbq0r3LbGeBpQgAT47fqdtifBRyXzROCd9ZKCqCBoqCoxHNyeBWA5SwttKrq7Ze5Ihfq6pJSO7Dd8CBKsLNpbr0uDytQfTYBKi_N26XvbsSplYRt__fGqQWdzl3Eq5w-c8oIhCs.JSYpc7Wy50vjgKlBzzI00w";
const realmId = "9341454878381146"; // Hargrove Fence sandbox company ID

const query = "SELECT * FROM Bill WHERE Balance > '0'";
const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query`;

axios
  .post(url, query, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/text",
      Accept: "application/json",
    },
  })
  .then((res) => {
    console.log("✅ Unpaid Bills:");
    console.dir(res.data.QueryResponse.Bill, { depth: null });
  })
  .catch((err) => {
    console.error("❌ Failed to fetch bills:");
    console.dir(err.response?.data || err);
  });
