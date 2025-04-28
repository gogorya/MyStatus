const ActiveMonitor = require("../models/ActiveMonitor");
const ActiveMonitorData = require("../models/ActiveMonitorData");

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
    await ActiveMonitorData.deleteOne({
      monitor: activeMonitorToDelete.monitorId,
    });

    return activeMonitorToDelete;
  } catch (error) {
    throw new Error("Failed to delete active monitor: " + error.message);
  }
};

module.exports = {
  activeMonitorExists,
  createActiveMonitor,
  deleteActiveMonitor,
};
