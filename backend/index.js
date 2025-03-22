// Imports
const express = require("express");
const cors = require("cors");
const { requireAuth } = require("@clerk/express");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

// Routes
const monitorRoutes = require("./routes/monitorRoutes");
const statusPageRoutes = require("./routes/statusPageRoutes");
const statusPagePublicRoutes = require("./routes/statusPagePublicRoutes");
const incidentRoutes = require("./routes/incidentRoutes");

// Others
const connectDB = require("./config/database");
const startCheckStatus = require("./jobs/checkStatus");

require("dotenv").config();

// Configure Express app
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN || "http://localhost:3000" }));
app.use(helmet());
if (process.env.NODE_ENV !== "development") {
  // Number of proxies between user and server
  app.set("trust proxy", parseInt(process.env.PROXIES));
  app.use(
    rateLimit({
      // 25 requests per 15 minutes
      windowMs: 15 * 60 * 1000,
      limit: 25,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

// Route to keep cloud container active
app.get("/ping", (req, res) => {
  res.send();
});

// Public
app.use("/public", statusPagePublicRoutes);

// Private
app.use(requireAuth());
app.use("/api/monitors", monitorRoutes);
app.use("/api/status-pages", statusPageRoutes);
app.use("/api/incidents", incidentRoutes);

// Database config and job
connectDB();
startCheckStatus();

// Start the server and listen for requests
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
