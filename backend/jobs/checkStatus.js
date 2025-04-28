const axios = require("axios");
const async = require("async");

const ActiveMonitor = require("../models/ActiveMonitor");
const ActiveMonitorData = require("../models/ActiveMonitorData");

const savePingData = async (monitorId, orgId, success) => {
  try {
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

    monitorData.lastThreeRequests.push(success);
    if (monitorData.lastThreeRequests.length > 3) {
      monitorData.lastThreeRequests.shift();
    }

    await monitorData.save();
  } catch (error) {
    console.error(`Failed to save ping data for ${monitorId}:`, error);
  }
};

module.exports = (agenda) => {
  agenda.define("checkStatus", async () => {
    const activeMonitors = await ActiveMonitor.find();

    const monitorTasks = activeMonitors.map((monitor) => async () => {
      try {
        const res = await axios.get(monitor.link);

        // response.status >= 200 && response.status < 400
        await savePingData(monitor.monitorId, monitor.orgId, true);
      } catch (error) {
        if (error.response) {
          // error.response.status >= 400 && error.response.status < 600
          await savePingData(monitor.monitorId, monitor.orgId, false);
        } else if (error.request) {
          try {
            // error.request, checking Internet connection
            const res = await axios.get(
              "https://captive.apple.com/hotspot-detect.html"
            );

            if (res && res.status === 200) {
              await savePingData(monitor.monitorId, monitor.orgId, false);
            }
          } catch (error) {
            console.log("Internet connection is down");
          }
        } else {
          console.error(`Failed to ping ${monitor.link}:`, error);
        }
      }
    });

    await async.parallelLimit(monitorTasks, 10);
  });
};
