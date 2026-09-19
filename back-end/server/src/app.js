import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import settingsRoutes from "./routes/settings.js";
import billingRoutes from "./routes/billing.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import publicRoutes from "./routes/public.js";
import webhookRoutes from "./routes/webhook.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({ limit: "10mb", verify: rawBodySaver }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/webhooks", webhookRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

export default app;
