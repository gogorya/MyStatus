const express = require("express");
const router = express.Router();
const statusPageController = require("../controllers/statusPageController");

router.get("", statusPageController.getStatusPages);
router.post("", statusPageController.createStatusPage);
router.patch("/:_id", statusPageController.updateStatusPage);
router.delete("/:_id", statusPageController.deleteStatusPage);

module.exports = router;
