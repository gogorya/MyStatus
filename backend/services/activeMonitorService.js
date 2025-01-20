const ActiveMonitor = require("../models/ActiveMonitor");

const activeMonitorExists = async (id) => {
  try {
    const activeMonitor = await ActiveMonitor.findOne({ id });
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
    const activeMonitorToDelete = await ActiveMonitor.findOne({ id: data.id });
    if (activeMonitorToDelete.orgId.toString() !== data.orgId.toString()) {
      throw new Error("Unauthorized");
    }
    await ActiveMonitor.findByIdAndDelete(activeMonitorToDelete._id);
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
