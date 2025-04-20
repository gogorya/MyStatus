const Organization = require("../models/Organization.js");

// Organization
const organizationExists = async (orgId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    return organization !== null;
  } catch (error) {
    throw new Error("Failed to check if organization exists: " + error.message);
  }
};

const createOrganization = async (orgId) => {
  try {
    const newOrganization = new Organization({ orgId });
    await newOrganization.save();
    return newOrganization;
  } catch (error) {
    throw new Error("Failed to create organization: " + error.message);
  }
};

module.exports = {
  organizationExists,
  createOrganization,
};
