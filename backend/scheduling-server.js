// File: backend/scheduling-server.js

import express from "express";
import cors from "cors";

import scheduleRouter from "./routes/scheduleRouter.js";
import scheduleConfirmRoute from "./routes/scheduleConfirmRoute.js";
import scheduleConflictCheckRoute from "./routes/scheduleConflictCheckRoute.js";
import fleetRouter from "./routes/fleetRouter.js";

const app = express(); // ✅ THIS must come before any app.use()

app.use(cors());
app.use(express.json());

app.use("/api/schedule", scheduleRouter);
app.use("/api/schedule/confirm", scheduleConfirmRoute);
app.use("/api/schedule/check-conflicts", scheduleConflictCheckRoute);
app.use("/api/fleet", fleetRouter);

app.listen(5004, () => {
  console.log("📅 Scheduling server running at http://localhost:5004");
});
