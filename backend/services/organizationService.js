const Organization = require("../models/Organization.js");

// Organization
const organizationExists = async (orgId) => {
  const organization = await Organization.findOne({ orgId });
  return organization !== null;
};

const createOrganization = async (orgId) => {
  const newOrganization = new Organization({ orgId });
  await newOrganization.save();
  return newOrganization;
};

// Monitor
const getMonitors = async (orgId) => {
  const organization = await Organization.findOne({ orgId });
  return organization.monitors;
};

const addMonitor = async (orgId, monitorId) => {
  const organization = await Organization.findOne({ orgId });
  const monitorExists = organization.monitors.some(
    (monitor) => monitor.toString() === monitorId.toString()
  );
  if (!monitorExists) {
    organization.monitors.push(monitorId);
    await organization.save();
  }
};

const deleteMonitor = async (orgId, monitorId) => {
  const organization = await Organization.findOne({ orgId });
  organization.monitors = organization.monitors.filter(
    (monitor) => monitor.toString() !== monitorId.toString()
  );
  await organization.save();
};

// StatusPage
const getStatusPages = async (orgId) => {
  const organization = await Organization.findOne({ orgId });
  return organization.statusPages;
};

const addStatusPage = async (orgId, statusPageId) => {
  const organization = await Organization.findOne({ orgId });
  const statusPageExists = organization.statusPages.some(
    (statusPage) => statusPage.toString() === statusPageId.toString()
  );
  if (!statusPageExists) {
    organization.statusPages.push(statusPageId);
    await organization.save();
  }
};

const deleteStatusPage = async (orgId, statusPageId) => {
  const organization = await Organization.findOne({ orgId });
  organization.statusPages = organization.statusPages.filter(
    (statusPage) => statusPage.toString() !== statusPageId.toString()
  );
  await organization.save();
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
