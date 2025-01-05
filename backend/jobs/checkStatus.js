const axios = require("axios");
const Agenda = require("agenda");
const async = require("async");
const ActiveMonitor = require("../models/ActiveMonitor");
const ActiveMonitorData = require("../models/ActiveMonitorData");
require("dotenv").config();

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI },
});

agenda.define("check status", async () => {
  const activeMonitors = await ActiveMonitor.find();
  const currentDate = new Date().toISOString().split("T")[0];

  const monitorTasks = activeMonitors.map((monitor) => async () => {
    try {
      const response = await axios.get(monitor.link);
      const success = response.status === 200;

      let monitorData = await ActiveMonitorData.findOne({ id: monitor._id });
      if (!monitorData) {
        monitorData = new ActiveMonitorData({ id: monitor._id, data: [] });
      }

      const lastRecord = monitorData.data[monitorData.data.length - 1];
      if (
        lastRecord &&
        lastRecord.date.toISOString().split("T")[0] === currentDate
      ) {
        if (success) {
          lastRecord.success += 1;
        } else {
          lastRecord.fail += 1;
        }
      } else {
        monitorData.data.push({
          date: new Date(),
          success: success ? 1 : 0,
          fail: success ? 0 : 1,
        });
      }

      await monitorData.save();
    } catch (error) {
      console.error(`Failed to ping ${monitor.link}:`, error);
    }
  });

  await async.parallelLimit(monitorTasks, 10);
});

agenda.on("ready", () => {
  agenda.every("5 minutes", "check status");
});
agenda.on("error", (error) => {
  console.error("Agenda error:", error);
});

const startCheckStatus = async () => {
  await agenda.start();
  console.log("Check status started");
};

module.exports = { startCheckStatus };
