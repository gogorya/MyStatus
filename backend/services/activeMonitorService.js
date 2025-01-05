const ActiveMonitor = require("../models/ActiveMonitor");

const activeMonitorExists = async (id) => {
  const activeMonitor = await ActiveMonitor.findOne({ id });
  return activeMonitor !== null;
};

const createActiveMonitor = async (data) => {
  const newActiveMonitor = new ActiveMonitor(data);
  await newActiveMonitor.save();
  return newActiveMonitor;
};

const deleteActiveMonitor = async (data) => {
  const activeMonitorToDelete = await ActiveMonitor.findOne({ id: data.id });
  if (activeMonitorToDelete.orgId.toString() !== data.orgId.toString()) {
    throw new Error("Unauthorized");
  }
  await ActiveMonitor.findByIdAndDelete(activeMonitorToDelete._id);
  return activeMonitorToDelete;
};

module.exports = {
  activeMonitorExists,
  createActiveMonitor,
  deleteActiveMonitor,
};
