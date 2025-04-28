// Imports
const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

// Routes
const monitorRoutes = require("./monitorRoutes");
const statusPageRoutes = require("./statusPageRoutes");
const statusPagePublicRoutes = require("./statusPagePublicRoutes");
const incidentRoutes = require("./incidentRoutes");

// Route to keep cloud container active
router.get("/ping", (req, res) => {
  res.send();
});

// Public
router.use("/public/status-pages-public", statusPagePublicRoutes);

// Private
router.use(requireAuth());
router.use("/api/monitors", monitorRoutes);
router.use("/api/status-pages", statusPageRoutes);
router.use("/api/incidents", incidentRoutes);

module.exports = router;
