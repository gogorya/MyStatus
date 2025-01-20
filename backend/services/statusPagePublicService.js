const StatusPage = require("../models/StatusPage.js");
const Monitor = require("../models/Monitor.js");
const ActiveMonitorData = require("../models/ActiveMonitorData.js");

const getStatusPagePublic = async (slug) => {
  try {
    const statusPage = await StatusPage.findOne({ slug });
    if (!statusPage || !statusPage.active) {
      throw new Error("Status page not found");
    }

    const monitorIds = statusPage.monitors;
    const monitorsData = [];

    for (const monitorId of monitorIds) {
      try {
        const monitor = await Monitor.findById(monitorId).select("name");
        const monitorDataDocs = await ActiveMonitorData.find({
          monitorId: monitorId,
        })
          .select("-__v -_id")
          .limit(30);
        const monitorData = monitorDataDocs.flatMap((doc) => doc.data);
        monitorsData.push({
          id: monitorId,
          name: monitor.name,
          data: monitorData,
        });
      } catch (error) {
        console.error(
          `Failed to fetch data for monitor ID ${monitorId}: ${error.message}`
        );
      }
    }

    return monitorsData;
  } catch (error) {
    if (error.message === "Status page not found") {
      throw new Error(error.message);
    } else {
      throw new Error(
        `Failed to get status page public data: ${error.message}`
      );
    }
  }
};

module.exports = { getStatusPagePublic };
