const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

router.get("", monitorController.getMonitors);
router.post("", monitorController.createMonitor);
router.patch("/:_id", monitorController.updateMonitor);
router.delete("/:_id", monitorController.deleteMonitor);

module.exports = router;
