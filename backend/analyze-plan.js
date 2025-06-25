// TAKEOFF AGENT SERVER (ESM version)
// Location: /backend/takeoffagent/server.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import analyzePlan from '../analyze-plan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectId = req.body.project_id || 'default';
    const dir = path.join(__dirname, 'uploads', projectId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// === Analyze Endpoint ===
app.post('/analyze', upload.fields([
  { name: 'plans', maxCount: 1 },
  { name: 'specs', maxCount: 1 }
]), async (req, res) => {
  const { project_id } = req.body;
  const plansFile = req.files?.plans?.[0];
  const specsFile = req.files?.specs?.[0] || null;

  if (!plansFile) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required "plans" upload.'
    });
  }

  console.log('📥 Received files for project:', project_id);
  console.log('🗂 Plans Path:', plansFile.path);
  if (specsFile) {
    console.log('🗂 Specs Path:', specsFile.path);
  } else {
    console.log('⚠️ No specs file uploaded.');
  }

  try {
    const result = await analyzePlan(plansFile.path);

    if (!result || typeof result !== 'string' || result.trim() === '') {
      throw new Error('Empty or invalid result returned from analyzePlan');
    }

    res.json({
      status: 'success',
      result,
      project_id,
      file_paths: {
        plans: plansFile.path,
        specs: specsFile?.path || null
      }
    });
  } catch (err) {
    console.error('❌ Analysis failed:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process takeoff.',
      error: err.message || 'Unknown error'
    });
  }
});

// === Startup ===
app.listen(port, () => {
  console.log(`🚀 TakeoffAgent backend listening on http://localhost:${port}`);
});

