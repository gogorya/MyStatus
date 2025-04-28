const ActiveMonitorData = require("../models/ActiveMonitorData");

module.exports = (agenda) => {
  agenda.define("dataCleanup", async () => {
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
  });
};
