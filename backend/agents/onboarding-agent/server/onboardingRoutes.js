import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Allow any field names with files
const upload = multer({ dest: "temp/" });

router.post("/", upload.any(), (req, res) => {
  try {
    const { name, company } = req.body;

    if (!name || !company) {
      return res.status(400).json({ error: "Missing name or company field" });
    }

    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    const employeeDir = path.join(uploadDir, company, name);
    fs.mkdirSync(employeeDir, { recursive: true });

    req.files.forEach((file) => {
      const destPath = path.join(employeeDir, file.originalname);
      fs.renameSync(file.path, destPath);
    });

    return res.json({
      success: true,
      message: `${req.files.length} files uploaded for ${name} at ${company}`,
      files: req.files.map((f) => f.originalname),
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
