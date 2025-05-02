const express = require("express");
const router = express.Router();
const deleteOrganizationController = require("../controllers/deleteOrganizationController");

router.post("", deleteOrganizationController.deleteOrganization);

module.exports = router;
