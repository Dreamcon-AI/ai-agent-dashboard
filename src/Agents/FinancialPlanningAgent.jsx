import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RocketIcon } from "lucide-react";
import axios from "axios";

const FinancialPlanningAgent = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with actual token
  const realmId = "9341454878381146"; // Hargrove Fence sandbox realm

  const fetchUnpaidBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = "SELECT * FROM Bill WHERE Balance > '0'";
const response = await axios.post("http://localhost:4000/api/fetch-unpaid-bills");
      setBills(response.data.QueryResponse.Bill || []);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
      setError("Failed to fetch bills. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💸</span>
            <div>
              <h2 className="text-xl font-semibold">Financial Planning Agent</h2>
              <p className="text-sm text-muted-foreground">
                Tracks job costs and automates bill payments by billing period.
              </p>
            </div>
          </div>

          <Button onClick={fetchUnpaidBills} className="mt-2">
            <RocketIcon className="mr-2 h-4 w-4" /> Fetch Unpaid Bills
          </Button>

          {loading && <p className="text-sm text-gray-500">Loading bills...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {bills.length > 0 && (
            <div className="mt-4 w-full">
              <h3 className="font-semibold mb-2">Unpaid Bills</h3>
              <ul className="space-y-3">
                {bills.map((bill) => (
                  <li
                    key={bill.Id}
                    className="border border-gray-300 rounded p-3 bg-gray-50 text-sm"
                  >
                    <p><strong>Vendor:</strong> {bill.VendorRef?.name || "N/A"}</p>
                    <p><strong>Date:</strong> {bill.TxnDate}</p>
                    <p><strong>Due:</strong> {bill.DueDate}</p>
                    <p><strong>Balance:</strong> ${bill.Balance}</p>
                    <p><strong>Job/Customer:</strong> {bill.CustomerRef?.name || "N/A"}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialPlanningAgent;
