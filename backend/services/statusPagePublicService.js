const StatusPage = require("../models/StatusPage.js");
const Monitor = require("../models/Monitor.js");
const ActiveMonitorData = require("../models/ActiveMonitorData.js");

const getStatusPagePublic = async (slug) => {
  const statusPage = await StatusPage.findOne({ slug });
  if (!statusPage) {
    throw new Error("Status page not found");
  }
  const monitorIds = statusPage.monitors;
  const monitorsData = [];

  for (const monitorId of monitorIds) {
    const monitor = await Monitor.findById(monitorId).select("name");
    const monitorDataDocs = await ActiveMonitorData.find({ id: monitorId })
      .select("-__v -_id") // Exclude __v and _id fields
      .limit(30);
    const monitorData = monitorDataDocs.flatMap((doc) => doc.data);
    monitorsData.push({
      id: monitorId,
      name: monitor.name,
      data: monitorData,
    });
  }
  // console.log(monitorsData);
  return monitorsData;
};

module.exports = { getStatusPagePublic };
