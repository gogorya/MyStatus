const Monitor = require("../models/Monitor.js");
const organizationService = require("./organizationService.js");

const getMonitors = async (orgId) => {
  const monitorIds = await organizationService.getMonitors(orgId);
  const monitors = await Monitor.find({
    _id: { $in: monitorIds },
  }).select("-orgId -__v");
  return monitors;
};

const createMonitor = async (data) => {
  const organizationExists = await organizationService.organizationExists(
    data.orgId
  );
  if (!organizationExists) {
    await organizationService.createOrganization(data.orgId);
  }

  const newMonitor = new Monitor(data);
  await newMonitor.save();
  organizationService.addMonitor(data.orgId, newMonitor._id);
  const savedMonitor = await Monitor.findById(newMonitor._id).select(
    "-orgId -__v"
  );
  return savedMonitor;
};

const updateMonitor = async (data) => {
  const monitorToUpdate = await Monitor.findById(data._id);
  if (
    monitorToUpdate.orgId !== data.orgId &&
    monitorToUpdate._id !== data._id
  ) {
    throw new Error("Unauthorized");
  }
  Object.assign(monitorToUpdate, data);
  await monitorToUpdate.save();
  const updatedMonitor = await Monitor.findById(data._id).select("-orgId -__v");
  return updatedMonitor;
};

const deleteMonitor = async (data) => {
  const monitorToDelete = await Monitor.findById(data._id);
  if (
    monitorToDelete.orgId !== data.orgId &&
    monitorToDelete._id !== data._id
  ) {
    throw new Error("Unauthorized");
  }
  organizationService.deleteMonitor(data.orgId, data._id);
  await Monitor.findByIdAndDelete(data._id);
  return monitorToDelete;
};

module.exports = { getMonitors, createMonitor, updateMonitor, deleteMonitor };
