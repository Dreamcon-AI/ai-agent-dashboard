import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "./routes/authRouter.js"; // adjust path if needed

const router = express.Router();
const DATA_FILE = "./fleetData.json";

// Load fleet data from file
let fleet = [];
try {
  const rawData = fs.readFileSync(DATA_FILE, "utf-8");
  fleet = JSON.parse(rawData);
} catch {
  console.warn("⚠️ No fleet data file found or invalid. Starting fresh.");
}

// Save fleet to file
function saveFleet() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(fleet, null, 2));
}

// GET all equipment (protected)
router.get("/", requireAuth, (req, res) => {
  res.json(fleet);
});

// ADD new equipment (protected)
router.post("/", requireAuth, (req, res) => {
  const { name, type, status } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: "Missing name or type" });
  }

  const newItem = {
    id: uuidv4(),
    name,
    type,
    status: status || "available",
  };
  fleet.push(newItem);
  saveFleet(); // 🔥 save to file
  res.status(201).json(newItem);
});

// UPDATE status (protected)
router.post("/:id/status", requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const item = fleet.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.status = status;
  saveFleet(); // 🔥 save to file
  res.json({ success: true });
});

export default router;
