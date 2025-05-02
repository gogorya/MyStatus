const Monitor = require("../models/Monitor.js");
const StatusPage = require("../models/StatusPage.js");
const Incident = require("../models/Incident.js");
const ActiveMonitor = require("../models/ActiveMonitor.js");
const ActiveMonitorData = require("../models/ActiveMonitorData.js");

const deleteOrganization = async (data) => {
  try {
    await Monitor.deleteMany({ orgId: data.orgId });
    await StatusPage.deleteMany({ orgId: data.orgId });
    await Incident.deleteMany({ orgId: data.orgId });
    await ActiveMonitor.deleteMany({ orgId: data.orgId });
    await ActiveMonitorData.deleteMany({ orgId: data.orgId });
    return data.orgId;
  } catch (error) {
    throw new Error("Failed to delete Organization: " + error.message);
  }
};

module.exports = { deleteOrganization };
