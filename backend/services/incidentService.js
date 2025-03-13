const monitorService = require("../services/monitorService.js");

const Incident = require("../models/Incident.js");

const formatResponse = (obj) => {
  delete obj.orgId;
  delete obj.__v;

  obj.monitor = { _id: obj.monitorId._id, name: obj.monitorId.name };
  delete obj.monitorId;

  obj.statusHistory.reverse();
  return obj;
};

const getIncidents = async (orgId) => {
  try {
    const incidents = await Incident.find({ orgId: orgId })
      .populate("monitorId", "name")
      .lean();
    for (let i of incidents) {
      formatResponse(i);
    }

    return incidents.reverse();
  } catch (error) {
    throw new Error("Failed to get incidents: " + error.message);
  }
};

const createIncident = async (data) => {
  try {
    const newIncident = new Incident(data);
    newIncident.statusHistory.push({
      status: data.status,
      message: data.message,
    });
    await newIncident.save();
    await monitorService.addIncident(data.monitorId, newIncident._id);

    const savedIncident = await Incident.findById(newIncident._id)
      .populate("monitorId", "name")
      .lean();
    formatResponse(savedIncident);

    return savedIncident;
  } catch (error) {
    throw new Error("Failed to create incident: " + error.message);
  }
};

const updateIncident = async (data) => {
  try {
    const incidentToUpdate = await Incident.findById(data._id);
    if (
      incidentToUpdate.orgId.toString() !== data.orgId.toString() ||
      incidentToUpdate.monitorId.toString() !== data.monitorId.toString()
    ) {
      throw new Error("Unauthorized");
    }

    if (
      incidentToUpdate.statusHistory[incidentToUpdate.statusHistory.length - 1]
        .status !== "Resolved"
    ) {
      if (data.name) {
        Object.assign(incidentToUpdate, { name: data.name });
      }
      if (data.status && data.message) {
        incidentToUpdate.statusHistory.push({
          status: data.status,
          message: data.message,
        });
      }
      await incidentToUpdate.save();
    } else {
      throw new Error("Cannot update a resolved incident");
    }

    const updatedIncident = await Incident.findById(incidentToUpdate._id)
      .populate("monitorId", "name")
      .lean();
    formatResponse(updatedIncident);

    return updatedIncident;
  } catch (error) {
    throw new Error("Failed to update incident: " + error.message);
  }
};

const deleteIncident = async (data) => {
  try {
    const incidentToDelete = await Incident.findById(data._id);
    if (incidentToDelete.orgId.toString() !== data.orgId.toString()) {
      throw new Error("Unauthorized");
    }

    await monitorService.deleteIncident(
      incidentToDelete.monitorId,
      incidentToDelete._id
    );
    const deletedIncident = await Incident.findByIdAndDelete(data._id)
      .populate("monitorId", "name")
      .lean();
    formatResponse(deletedIncident);

    return deletedIncident;
  } catch (error) {
    throw new Error("Failed to delete incident: " + error.message);
  }
};

module.exports = {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
