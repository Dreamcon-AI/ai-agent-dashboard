import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import onboardingRoutes from "./onboardingRoutes.js";
import { fileURLToPath } from "url";

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly load .env from the same directory
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/onboarding", onboardingRoutes);

app.listen(PORT, () => {
  console.log(`✅ Onboarding Agent Server running on port ${PORT}`);
});
