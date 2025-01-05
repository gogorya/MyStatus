const express = require("express");
const router = express.Router();
const statusPagePublicController = require("../controllers/statusPagePublicController");

router.post(
  "/get-status-page-data",
  statusPagePublicController.getStatusPagePublic
);

module.exports = router;
