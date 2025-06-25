import express from "express";
import cors from "cors";
import fleetRouter from "./routes/fleetRouter.js";
import authRouter, { requireAuth } from "./routes/authRouter.js";

app.use("/api", authRouter); // login route: POST /api/login


const app = express();
app.use(cors()); // ✅ Enable CORS
app.use(express.json());
app.use("/api/fleet", fleetRouter);

app.listen(5005, () => {
  console.log("🚚 Fleet server running at http://localhost:5005");
});
