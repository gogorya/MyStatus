const express = require("express");
const router = express.Router();
const monitorController = require("../controllers/monitorController");

router.get("/get", monitorController.getMonitors);
router.post("/create", monitorController.createMonitor);
router.post("/update", monitorController.updateMonitor);
router.post("/delete", monitorController.deleteMonitor);

module.exports = router;
