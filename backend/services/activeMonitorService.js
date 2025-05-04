const activeMonitorDataService = require("./activeMonitorDataService");

const ActiveMonitor = require("../models/ActiveMonitor");

const getActiveMonitors = async () => {
  try {
    const activeMonitors = await ActiveMonitor.find();
    return activeMonitors;
  } catch (error) {
    throw new Error("Failed to get active monitors: " + error.message);
  }
};

const activeMonitorExists = async (id) => {
  try {
    const activeMonitor = await ActiveMonitor.findOne({ monitorId: id });
    return activeMonitor !== null;
  } catch (error) {
    throw new Error(
      "Failed to check if active monitor exists: " + error.message
    );
  }
};

const createActiveMonitor = async (data) => {
  try {
    const newActiveMonitor = new ActiveMonitor(data);
    await newActiveMonitor.save();
    return newActiveMonitor;
  } catch (error) {
    throw new Error("Failed to create active monitor: " + error.message);
  }
};

const deleteActiveMonitor = async (data) => {
  try {
    const activeMonitorToDelete = await ActiveMonitor.findOne({
      monitorId: data.monitorId,
    });
    if (activeMonitorToDelete.orgId.toString() !== data.orgId.toString()) {
      throw new Error("Unauthorized");
    }

    await ActiveMonitor.findByIdAndDelete(activeMonitorToDelete._id);
    await activeMonitorDataService.deleteActiveMonitorData({
      monitor: activeMonitorToDelete.monitorId,
    });

    return activeMonitorToDelete;
  } catch (error) {
    throw new Error("Failed to delete active monitor: " + error.message);
  }
};

module.exports = {
  getActiveMonitors,
  activeMonitorExists,
  createActiveMonitor,
  deleteActiveMonitor,
};
