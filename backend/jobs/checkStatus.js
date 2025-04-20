const axios = require("axios");
const Agenda = require("agenda");
const async = require("async");

const ActiveMonitor = require("../models/ActiveMonitor");
const ActiveMonitorData = require("../models/ActiveMonitorData");

require("dotenv").config();

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI },
});

const savePingData = async (monitorId, orgId, success) => {
  let monitorData = await ActiveMonitorData.findOne({ monitor: monitorId });
  const currentDate = new Date().toISOString().split("T")[0];
  if (!monitorData) {
    monitorData = new ActiveMonitorData({
      monitor: monitorId,
      orgId: orgId,
      data: [],
    });
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
};

agenda.define("check status", async () => {
  const activeMonitors = await ActiveMonitor.find();

  const monitorTasks = activeMonitors.map((monitor) => async () => {
    try {
      const response = await axios.get(monitor.link);
      try {
        // response.status >= 200 && response.status < 300;
        await savePingData(monitor.monitorId, monitor.orgId, true);
      } catch (error) {
        console.error(`Failed to save ping data for ${monitor.link}:`, error);
      }
    } catch (error) {
      if (error.request || error.response) {
        try {
          // error.request || (error.response.status >= 300 && error.response.status < 600))
          await savePingData(monitor.monitorId, monitor.orgId, false);
        } catch (error) {
          console.error(`Failed to save ping data for ${monitor.link}:`, error);
        }
      } else {
        console.error(`Failed to ping ${monitor.link}:`, error);
      }
    }
  });

  await async.parallelLimit(monitorTasks, 10);
});

agenda.on("ready", () => {
  agenda.every("1 minutes", "check status");
});
agenda.on("error", (error) => {
  console.error("Agenda error:", error);
});

const startCheckStatus = async () => {
  await agenda.start();
  console.log("Check status started");
};

module.exports = startCheckStatus;
