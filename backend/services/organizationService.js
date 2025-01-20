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

// Monitor
const getMonitors = async (orgId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    if (!organization) {
      return [];
    }
    return organization.monitors;
  } catch (error) {
    throw new Error("Failed to get monitors: " + error.message);
  }
};

const addMonitor = async (orgId, monitorId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    const monitorExists = organization.monitors.some(
      (monitor) => monitor.toString() === monitorId.toString()
    );
    if (!monitorExists) {
      organization.monitors.push(monitorId);
      await organization.save();
    }
  } catch (error) {
    throw new Error("Failed to add monitor: " + error.message);
  }
};

const deleteMonitor = async (orgId, monitorId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    organization.monitors = organization.monitors.filter(
      (monitor) => monitor.toString() !== monitorId.toString()
    );
    await organization.save();
  } catch (error) {
    throw new Error("Failed to delete monitor: " + error.message);
  }
};

// StatusPage
const getStatusPages = async (orgId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    if (!organization) {
      return [];
    }
    return organization.statusPages;
  } catch (error) {
    throw new Error("Failed to get status pages: " + error.message);
  }
};

const addStatusPage = async (orgId, statusPageId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    const statusPageExists = organization.statusPages.some(
      (statusPage) => statusPage.toString() === statusPageId.toString()
    );
    if (!statusPageExists) {
      organization.statusPages.push(statusPageId);
      await organization.save();
    }
  } catch (error) {
    throw new Error("Failed to add status page: " + error.message);
  }
};

const deleteStatusPage = async (orgId, statusPageId) => {
  try {
    const organization = await Organization.findOne({ orgId });
    organization.statusPages = organization.statusPages.filter(
      (statusPage) => statusPage.toString() !== statusPageId.toString()
    );
    await organization.save();
  } catch (error) {
    throw new Error("Failed to delete status page: " + error.message);
  }
};

module.exports = {
  organizationExists,
  createOrganization,
  getMonitors,
  addMonitor,
  deleteMonitor,
  getStatusPages,
  addStatusPage,
  deleteStatusPage,
};
