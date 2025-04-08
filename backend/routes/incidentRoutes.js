const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");

router.get("", incidentController.getIncidents);
router.post("", incidentController.createIncident);
router.patch("/:_id", incidentController.updateIncident);
router.delete("/:_id", incidentController.deleteIncident);

module.exports = router;
