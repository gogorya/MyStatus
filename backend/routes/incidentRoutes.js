const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");

router.get("/get", incidentController.getIncidents);
router.post("/create", incidentController.createIncident);
router.post("/update", incidentController.updateIncident);
router.post("/delete", incidentController.deleteIncident);

module.exports = router;
