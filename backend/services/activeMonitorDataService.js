const ActiveMonitorData = require("../models/ActiveMonitorData");

const getActiveMonitorData = async (data) => {
  try {
    const activeMonitorData = await ActiveMonitorData.findOne({
      monitor: data.monitor,
    });
    return activeMonitorData
      ? activeMonitorData
      : new ActiveMonitorData({
          monitor: data.monitor,
          orgId: data.orgId,
        });
  } catch (error) {
    throw new Error("Failed to get active monitor data: " + error.message);
  }
};

const cleanOldData = async () => {
  try {
    const updatePipeline = [
      {
        $set: {
          data: { $slice: ["$data", -45] },
        },
      },
    ];
    await ActiveMonitorData.updateMany(
      {
        "data.45": { $exists: true },
      },
      updatePipeline
    );
  } catch (error) {
    throw new Error("Failed to clean active monitor data: " + error.message);
  }
};

const deleteActiveMonitorData = async (data) => {
  try {
    const deletedActiveMonitorData = await ActiveMonitorData.deleteOne({
      monitor: data.monitor,
    });
    return deletedActiveMonitorData;
  } catch (error) {
    throw new Error("Failed to delete active monitor data: " + error.message);
  }
};

module.exports = {
  getActiveMonitorData,
  cleanOldData,
  deleteActiveMonitorData,
};
