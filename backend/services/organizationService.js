const Organization = require("../models/Organization.js");

const organizationExists = async (orgId) => {
  const organization = await Organization.findOne({ orgId });
  return organization !== null;
};

const createOrganization = async (orgId) => {
  const newOrganization = new Organization({ orgId });
  await newOrganization.save();
  return newOrganization;
};

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

module.exports = {
  organizationExists,
  createOrganization,
  getMonitors,
  addMonitor,
  deleteMonitor,
};
