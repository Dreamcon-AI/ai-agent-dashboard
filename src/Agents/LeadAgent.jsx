import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";

export default function LeadAgent() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleRunLeads = async () => {
    setLoading(true);
    setOutput("");
    toast({ title: "🔍 Running LeadAgent..." });

    try {
      const response = await fetch("http://localhost:3003/run-lead-agent", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Server error running LeadAgent");

      const data = await response.json();
      setOutput(data.message || "✅ LeadAgent run completed.");
      toast({ title: "✅ LeadAgent finished" });
    } catch (err) {
      console.error(err);
      toast({ title: "❌ Failed to run LeadAgent" });
      setOutput("Error running LeadAgent. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl rounded-2xl p-4">
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">📡 LeadAgent</h2>
        <p className="text-sm text-muted-foreground">
          Scans PlanCenterNW.com for fencing leads in OR/WA.
        </p>

        <Button onClick={handleRunLeads} disabled={loading}>
          {loading ? "Running..." : "Run LeadAgent"}
        </Button>

        {output && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap text-black">
            {output}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
