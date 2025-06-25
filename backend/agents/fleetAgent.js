// File: backend/agents/fleetAgent.js

import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const fleetDataFile = path.join(process.cwd(), 'backend/data/fleet.json');

function loadFleet() {
  if (!fs.existsSync(fleetDataFile)) return [];
  return JSON.parse(fs.readFileSync(fleetDataFile, 'utf8'));
}

function saveFleet(data) {
  fs.writeFileSync(fleetDataFile, JSON.stringify(data, null, 2));
}

export const FleetAgent = {
  getAll() {
    return loadFleet();
  },

  getById(id) {
    return loadFleet().find(item => item.id === id);
  },

  updateStatus(id, status) {
    const fleet = loadFleet();
    const item = fleet.find(f => f.id === id);
    if (item) {
      item.status = status;
      saveFleet(fleet);
      return item;
    }
    return null;
  },

  create(newItem) {
    const fleet = loadFleet();
    const item = { id: uuid(), ...newItem };
    fleet.push(item);
    saveFleet(fleet);
    return item;
  },

  delete(id) {
    let fleet = loadFleet();
    fleet = fleet.filter(f => f.id !== id);
    saveFleet(fleet);
    return true;
  },
};
