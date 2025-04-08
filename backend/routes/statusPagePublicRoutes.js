const express = require("express");
const router = express.Router();
const statusPagePublicController = require("../controllers/statusPagePublicController");

router.get("/:slug", statusPagePublicController.getStatusPagePublic);

module.exports = router;
