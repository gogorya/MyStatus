const incidentService = require("../services/incidentService");

const getIncidents = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const incidents = await incidentService.getIncidents(orgId);
    res.status(200).json({ data: { incidents } });
  } catch (error) {
    res.status(500).json({
      message: "Unable to get incidents",
      error: error.message,
    });
  }
};

const createIncident = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const data = { orgId, ...req.body.data };
    const createdIncident = await incidentService.createIncident(data);
    res.status(201).json({
      data: {
        incident: createdIncident,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to create incident",
      error: error.message,
    });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const data = { orgId, ...req.body.data };
    const updatedIncident = await incidentService.updateIncident(data);
    res.status(201).json({
      data: {
        incident: updatedIncident,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update incident",
      error: error.message,
    });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const { _id } = req.body.data;
    const data = { orgId, _id };
    const deletedIncident = await incidentService.deleteIncident(data);
    res.status(201).json({
      data: {
        incident: deletedIncident,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete incident",
      error: error.message,
    });
  }
};

module.exports = {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
