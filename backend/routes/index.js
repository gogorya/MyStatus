// Imports
const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

// Routes
const monitorRoutes = require("./monitorRoutes");
const statusPageRoutes = require("./statusPageRoutes");
const statusPagePublicRoutes = require("./statusPagePublicRoutes");
const incidentRoutes = require("./incidentRoutes");
const deleteOrganizationRoutes = require("./deleteOrganizationRoutes");

// Route to keep cloud container active
router.get("/ping", (req, res) => {
  res.send();
});

// Route for organization.deleted events from clerk
router.use("/webhooks/delete-organization", deleteOrganizationRoutes);

// Public
router.use("/public/status-pages-public", statusPagePublicRoutes);

// Private
router.use(requireAuth());
router.use("/api/monitors", monitorRoutes);
router.use("/api/status-pages", statusPageRoutes);
router.use("/api/incidents", incidentRoutes);

module.exports = router;
