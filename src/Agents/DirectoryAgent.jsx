import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RocketIcon } from "lucide-react";

const DirectoryAgent = () => {
  const [directory, setDirectory] = useState([]);
  const [search, setSearch] = useState("");

  const handleReceiveEntry = (entry) => {
    setDirectory((prev) => [...prev, entry]);
  };

  // Inter-agent communication: expose receive function
  if (typeof window !== "undefined") {
    window.__DirectoryAgent__ = {
      receive: handleReceiveEntry,
    };
  }

  const filteredDirectory = directory.filter((entry) =>
    entry.name.toLowerCase().includes(search.toLowerCase()) ||
    entry.phone.toLowerCase().includes(search.toLowerCase()) ||
    entry.email.toLowerCase().includes(search.toLowerCase()) ||
    entry.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📗</span>
            <div>
              <h2 className="text-xl font-semibold">Employee Directory</h2>
              <p className="text-sm text-muted-foreground">
                A live record of all employee contact data entered by the Onboarding Agent.
              </p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search directory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded text-black"
          />

          {filteredDirectory.length === 0 ? (
            <p className="text-gray-500 italic">No entries found.</p>
          ) : (
            <ul className="space-y-2">
              {filteredDirectory.map((entry, index) => (
                <li key={index} className="border p-3 rounded bg-gray-50">
                  <p><strong>Name:</strong> {entry.name}</p>
                  <p><strong>Phone:</strong> {entry.phone}</p>
                  <p><strong>Email:</strong> {entry.email}</p>
                  <p><strong>Address:</strong> {entry.address}</p>
                </li>
              ))}
            </ul>
          )}

          <Button className="mt-4" disabled>
            <RocketIcon className="mr-2 h-4 w-4" /> Listening for Entries
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectoryAgent;