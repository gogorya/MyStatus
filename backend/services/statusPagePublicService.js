const StatusPage = require("../models/StatusPage.js");
const Monitor = require("../models/Monitor.js");
const ActiveMonitorData = require("../models/ActiveMonitorData.js");
const Incident = require("../models/Incident.js");

const getStatusPagePublic = async (slug) => {
  try {
    const statusPage = await StatusPage.findOne({ slug });
    if (!statusPage || !statusPage.active) {
      throw new Error("Status page not found");
    }

    const monitors = await Monitor.find({
      _id: statusPage.monitors,
      active: true,
    });

    const monitorsData = await ActiveMonitorData.find(
      {
        monitor: monitors,
      },
      { data: { $slice: -30 } }
    ).populate("monitor");
    monitorsData.sort((a, b) =>
      a.monitor._id.getTimestamp() < b.monitor._id.getTimestamp() ? -1 : 1
    );

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const incidentsData = await Incident.find({
      monitor: monitors,
      createdAt: { $gte: thirtyDaysAgo },
    }).populate("monitor");
    incidentsData.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

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
