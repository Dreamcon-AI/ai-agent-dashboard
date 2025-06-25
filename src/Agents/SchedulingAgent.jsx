// File: frontend/components/SchedulingAgent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const SchedulingAgent = () => {
  const [inputText, setInputText] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [parsedEvent, setParsedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null);
  const [crewFilter, setCrewFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [mic, setMic] = useState(null);
  const [equipmentAvailable, setEquipmentAvailable] = useState({ bobcat: true, auger: true });
  const calendarId = "blcto2tpkhisonlouirt5kql4c@group.calendar.google.com";

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setInputText(speech);
    };
    setMic(recognition);
  }, []);

  const handleVoiceInput = () => {
    if (mic) mic.start();
  };

  const handleParse = async () => {
    setStatusMsg("Parsing...");
    try {
      const res = await axios.post("http://localhost:5004/api/schedule/create", {
        inputText,
        equipmentAvailability: equipmentAvailable,
      });
      setParsedEvent(res.data.event || {});
      setShowModal(true);
      setStatusMsg("");
      setConflictWarning(null);
    } catch (err) {
      console.error("Scheduling failed:", err);
      setStatusMsg("❌ Scheduling failed.");
    }
  };

  const confirmSchedule = async () => {
    const { "start.dateTime": start, "end.dateTime": end, crew, equipment } = parsedEvent;

    try {
      const conflictRes = await axios.post("http://localhost:5004/api/schedule/check-conflicts", {
        start,
        end,
        crew,
        equipment,
      });

      if (conflictRes.data.ok === false) {
        const messages = conflictRes.data.conflicts.map((c) => {
          return c.type === "crew"
            ? `Crew conflict with: ${c.event.summary}`
            : `Equipment (${c.item}) conflict with: ${c.event.summary}`;
        });
        setConflictWarning(messages.join("\n"));
        return;
      }

      const colorMappedEvent = {
        ...parsedEvent,
        colorId: (() => {
          const desc = parsedEvent.description?.toLowerCase() || "";
          if (desc.includes("boli")) return "9";
          if (desc.includes("standard") || desc.includes("base")) return "8";
          if (desc.includes("l&i") || desc.includes("washington")) return "10";
          if (desc.includes("davis bacon")) return "3";
          return undefined;
        })(),
      };

      await axios.post("http://localhost:5004/api/schedule/confirm", colorMappedEvent);
      setStatusMsg("✅ Event scheduled!");
      setShowModal(false);
      setInputText("");
    } catch (err) {
      console.error("Conflict check or final schedule post failed:", err);
      setStatusMsg("❌ Failed to confirm schedule.");
    }
  };

  const toggleEquipment = (key) => {
    setEquipmentAvailable((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Schedule a Job</h2>
        <input
          type="text"
          placeholder="e.g. Schedule Tara to install with Bobcat next Tuesday 9am"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleParse}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Review Schedule
          </button>
          <button
            onClick={handleVoiceInput}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            🎤 Speak
          </button>
        </div>
        <p className="text-sm mt-2">{statusMsg}</p>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by crew"
          value={crewFilter}
          onChange={(e) => setCrewFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="boli">BOLI</option>
          <option value="standard">Standard</option>
          <option value="l&i">L&I</option>
          <option value="davis bacon">Davis Bacon</option>
        </select>
      </div>

      <div className="flex gap-6 text-sm items-center">
        <div>Equipment Toggle:</div>
        {Object.entries(equipmentAvailable).map(([item, available]) => (
          <label key={item} className="flex gap-1 items-center">
            <input
              type="checkbox"
              checked={available}
              onChange={() => toggleEquipment(item)}
            />
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </label>
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-500 inline-block"></span> BOLI</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-400 inline-block"></span> Standard</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 inline-block"></span> L&I</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-purple-500 inline-block"></span> Davis Bacon</div>
      </div>

      <div className="calendar-container rounded overflow-hidden shadow">
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
            calendarId
          )}&ctz=America%2FLos_Angeles`}
          style={{ border: 0 }}
          width="100%"
          height="700"
          frameBorder="0"
          scrolling="no"
          title="Zochert Calendar"
        ></iframe>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Event</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Summary:</strong> {parsedEvent.summary}</li>
              <li><strong>Location:</strong> {parsedEvent.location}</li>
              <li><strong>Start:</strong> {parsedEvent['start.dateTime']}</li>
              <li><strong>End:</strong> {parsedEvent['end.dateTime']}</li>
              <li><strong>Description:</strong> {parsedEvent.description}</li>
              <li><strong>Crew:</strong> {parsedEvent.crew}</li>
              <li><strong>Equipment:</strong> {(parsedEvent.equipment || []).join(", ")}</li>
            </ul>
            {conflictWarning && (
              <div className="mt-4 text-red-600 whitespace-pre-line text-sm border border-red-300 bg-red-50 p-2 rounded">
                ⚠️ Conflicts detected:
                <br />
                {conflictWarning}
              </div>
            )}
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={confirmSchedule}
                disabled={!!conflictWarning}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingAgent;
