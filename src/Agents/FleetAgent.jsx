// File: frontend/components/FleetAgent.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const statusColors = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-yellow-100 text-yellow-800",
  service: "bg-red-100 text-red-800",
};

const FleetAgent = () => {
  const [fleet, setFleet] = useState([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const fetchFleet = async () => {
    try {
     const res = await axios.get("http://localhost:5005/api/fleet");
      setFleet(res.data);
      setStatusMsg("");
    } catch (err) {
      console.error("Fetch failed:", err);
      setStatusMsg("❌ Could not load fleet data");
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.post(`http://localhost:5005/api/fleet/${id}/status`, { status });
      fetchFleet();
    } catch (err) {
      console.error("Status update failed:", err);
      setStatusMsg("❌ Failed to update equipment status");
    }
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newType.trim()) {
      setStatusMsg("⚠️ Name and type required.");
      return;
    }

    try {
      await axios.post("http://localhost:5005/api/fleet", {
        name: newName.trim(),
        type: newType.trim(),
        status: "available",
      });
      setNewName("");
      setNewType("");
      fetchFleet();
    } catch (err) {
      console.error("Add failed:", err);
      setStatusMsg("❌ Failed to add equipment");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Fleet Manager</h2>
      <p className="text-sm text-gray-600">Manage truck and equipment status.</p>

      {statusMsg && <p className="text-red-600">{statusMsg}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Equipment name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Type (e.g., Bobcat)"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Add
        </button>
      </div>

      <table className="w-full text-sm border mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fleet.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2 font-medium">{item.name}</td>
              <td className="p-2">{item.type}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </td>
              <td className="p-2 flex flex-wrap gap-1">
                {Object.keys(statusColors).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(item.id, status)}
                    className="px-2 py-1 border rounded text-xs"
                  >
                    Mark {status}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FleetAgent;
