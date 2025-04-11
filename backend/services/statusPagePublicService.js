const incidentService = require("./incidentService.js");

const StatusPage = require("../models/StatusPage.js");
const Monitor = require("../models/Monitor.js");
const ActiveMonitorData = require("../models/ActiveMonitorData.js");

const getStatusPagePublic = async (slug) => {
  try {
    const statusPage = await StatusPage.findOne({ slug });
    if (!statusPage || !statusPage.active) {
      throw new Error("Status page not found");
    }

    const monitorsData = [];
    const incidentsData = [];

    for (const monitorId of statusPage.monitors) {
      try {
        const monitor = await Monitor.findById(monitorId);
        if (monitor.active) {
          // Monitor data
          const monitorDataDocs = await ActiveMonitorData.find({
            monitorId: monitorId,
          }).limit(30);
          const monitorData = monitorDataDocs.flatMap((doc) => doc.data);
          monitorsData.push({
            id: monitorId,
            name: monitor.name,
            data: monitorData,
          });

          // Incident data
          const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
          for (const incidentId of monitor.incidents) {
            if (
              Date.now() - incidentId.getTimestamp().getTime() <=
              THIRTY_DAYS_MS
            ) {
              const incident = await incidentService.getIncident(incidentId);
              incidentsData.push(incident);
            }
          }
        }
      } catch (error) {
        console.error(
          `Failed to fetch data for monitor ID ${monitorId}: ${error.message}`
        );
      }
    }

    incidentsData.sort((a, b) =>
      a._id.getTimestamp() < b._id.getTimestamp() ? 1 : -1
    );

    return { monitorsData, incidentsData };
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
