const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profileRoutes");
const assetRoutes = require("./routes/assetRoutes");
const generationRoutes = require("./routes/generationRoutes");
const authMiddleware = require("./middleware/auth");
const { generateContent } = require("./services/generationService");
const { generateChannelContent } = require("./services/contentServices");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authMiddleware);
app.use("/api/profile", profileRoutes);
app.use("/api/assets", assetRoutes);

// app.use('/api', generationRoutes);
app.use("/api/generate", async (req, res, next) => {
  const result = await generateChannelContent(req.body);
  console.log({ result });
  return res.json(result);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(error);
  const status = error.status || 500;
  res
    .status(status)
    .json({ message: error.message || "Internal server error" });
});

module.exports = app;
