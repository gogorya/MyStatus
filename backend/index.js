const express = require("express");
const cors = require("cors");
const { requireAuth } = require("@clerk/express");

const monitorRoutes = require("./routes/monitorRoutes");
const statusPageRoutes = require("./routes/statusPageRoutes");
const statusPagePublicRoutes = require("./routes/statusPagePublicRoutes");
const incidentRoutes = require("./routes/incidentRoutes");

const connectDB = require("./config/database");
const startCheckStatus = require("./jobs/checkStatus");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors()); // fix for production // add helmet?

startCheckStatus();

// Public
app.use("/public", statusPagePublicRoutes);

// Private
app.use("/api/monitors", requireAuth(), monitorRoutes);
app.use("/api/status-pages", requireAuth(), statusPageRoutes);
app.use("/api/incidents", requireAuth(), incidentRoutes);

connectDB();

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
