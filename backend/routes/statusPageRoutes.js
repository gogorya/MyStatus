const express = require("express");
const router = express.Router();
const statusPageController = require("../controllers/statusPageController");

router.get("/get", statusPageController.getStatusPages);
router.post("/create", statusPageController.createStatusPage);
router.post("/update", statusPageController.updateStatusPage);
router.post("/delete", statusPageController.deleteStatusPage);

module.exports = router;
