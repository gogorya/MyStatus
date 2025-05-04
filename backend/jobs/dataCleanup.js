const activeMonitorDataService = require("../services/activeMonitorDataService");

module.exports = (agenda) => {
  agenda.define("dataCleanup", async () => {
    try {
      await activeMonitorDataService.cleanOldData();
    } catch (error) {
      throw new Error("Job dataCleanup failed: " + error.message);
    }
  });
};
