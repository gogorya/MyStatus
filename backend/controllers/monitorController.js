const monitorService = require("../services/monitorService");

const getMonitors = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const monitors = await monitorService.getMonitors(orgId);
    res.status(200).json({ data: { monitors } });
  } catch (error) {
    res.status(500).json({
      message: "Unable to get monitors",
      error: error.message,
    });
  }
};

const createMonitor = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const data = { orgId, ...req.body.data };
    const createdMonitor = await monitorService.createMonitor(data);
    res.status(201).json({
      data: {
        monitor: createdMonitor,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to create monitor",
      error: error.message,
    });
  }
};

const updateMonitor = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const _id = req.params._id;
    const data = { orgId, _id, ...req.body.data };
    const updatedMonitor = await monitorService.updateMonitor(data);
    res.status(201).json({
      data: {
        monitor: updatedMonitor,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update monitor",
      error: error.message,
    });
  }
};

const deleteMonitor = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const _id = req.params._id;
    const data = { orgId, _id };
    await monitorService.deleteMonitor(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete monitor",
      error: error.message,
    });
  }
};

module.exports = { getMonitors, createMonitor, updateMonitor, deleteMonitor };
