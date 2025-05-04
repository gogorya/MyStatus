const Incident = require("../models/Incident.js");

const getIncidents = async (orgId) => {
  try {
    const incidents = await Incident.find({ orgId: orgId }).populate("monitor");
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
    await newIncident.populate("monitor");

    return newIncident;
  } catch (error) {
    throw new Error("Failed to create incident: " + error.message);
  }
};

const updateIncident = async (data) => {
  try {
    const incidentToUpdate = await Incident.findById(data._id);
    if (
      incidentToUpdate.orgId.toString() !== data.orgId.toString() ||
      incidentToUpdate.monitor.toString() !== data.monitor.toString()
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

    await incidentToUpdate.populate("monitor");

    return incidentToUpdate;
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

    const deletedIncident = await Incident.findByIdAndDelete(data._id).populate(
      "monitor"
    );

    return deletedIncident;
  } catch (error) {
    throw new Error("Failed to delete incident: " + error.message);
  }
};

const deleteIncidents = async (data) => {
  try {
    const deleteResult = await Incident.deleteMany({
      monitor: data.monitor,
    });
    return deleteResult;
  } catch (error) {
    throw new Error("Failed to delete incidents: " + error.message);
  }
};

module.exports = {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  deleteIncidents,
};
