const organizationService = require("./organizationService.js");
const activeMonitorService = require("./activeMonitorService.js");

const Monitor = require("../models/Monitor.js");
const StatusPage = require("../models/StatusPage.js");

const getMonitors = async (orgId) => {
  try {
    const monitorIds = await organizationService.getMonitors(orgId);
    const monitors = await Monitor.find({
      _id: { $in: monitorIds },
    }).select("-orgId -__v");
    return monitors;
  } catch (error) {
    throw new Error("Failed to get monitors: " + error.message);
  }
};

const createMonitor = async (data) => {
  try {
    const organizationExists = await organizationService.organizationExists(
      data.orgId
    );
    if (!organizationExists) {
      await organizationService.createOrganization(data.orgId);
    }

    const newMonitor = new Monitor(data);
    await newMonitor.save();
    await organizationService.addMonitor(data.orgId, newMonitor._id);
    const savedMonitor = await Monitor.findById(newMonitor._id).select(
      "-orgId -__v"
    );

    // If Active, add to ActiveMonitor
    if (newMonitor.active) {
      try {
        await activeMonitorService.createActiveMonitor({
          orgId: newMonitor.orgId,
          monitorId: newMonitor._id,
          link: newMonitor.link,
        });
      } catch (error) {
        throw new Error("Failed to create active monitor: " + error.message);
      }
    }

    return savedMonitor;
  } catch (error) {
    throw new Error("Failed to create monitor: " + error.message);
  }
};

const updateMonitor = async (data) => {
  try {
    const monitorToUpdate = await Monitor.findById(data._id);
    const oldLink = monitorToUpdate.link;
    if (
      monitorToUpdate.orgId.toString() !== data.orgId.toString() ||
      monitorToUpdate._id.toString() !== data._id.toString()
    ) {
      throw new Error("Unauthorized");
    }
    Object.assign(monitorToUpdate, data);
    await monitorToUpdate.save();
    const updatedMonitor = await Monitor.findById(data._id).select(
      "-orgId -__v"
    );

    const holdUpdatedMonitor = await Monitor.findById(data._id);
    const activeMonitorExists = await activeMonitorService.activeMonitorExists(
      holdUpdatedMonitor._id
    );

    try {
      if (!activeMonitorExists && holdUpdatedMonitor.active) {
        // If Active, add to ActiveMonitor
        await activeMonitorService.createActiveMonitor({
          orgId: holdUpdatedMonitor.orgId,
          monitorId: holdUpdatedMonitor._id,
          link: holdUpdatedMonitor.link,
        });
      } else if (activeMonitorExists && !holdUpdatedMonitor.active) {
        // If not Active, delete from ActiveMonitor
        await activeMonitorService.deleteActiveMonitor({
          monitorId: holdUpdatedMonitor._id,
          orgId: holdUpdatedMonitor.orgId,
        });
      } else if (activeMonitorExists && holdUpdatedMonitor.active) {
        // Update link, delete and insert
        if (oldLink != holdUpdatedMonitor.link) {
          await activeMonitorService.deleteActiveMonitor({
            monitorId: holdUpdatedMonitor._id,
            orgId: holdUpdatedMonitor.orgId,
          });
          await activeMonitorService.createActiveMonitor({
            orgId: holdUpdatedMonitor.orgId,
            monitorId: holdUpdatedMonitor._id,
            link: holdUpdatedMonitor.link,
          });
        }
      } else {
        // Do nothing
      }
    } catch (error) {
      throw new Error("Failed to update active monitor: " + error.message);
    }

    return updatedMonitor;
  } catch (error) {
    throw new Error("Failed to update monitor: " + error.message);
  }
};

const deleteMonitor = async (data) => {
  try {
    const monitorToDelete = await Monitor.findById(data._id);
    if (
      monitorToDelete.orgId.toString() !== data.orgId.toString() ||
      monitorToDelete._id.toString() !== data._id.toString()
    ) {
      throw new Error("Unauthorized");
    }

    await StatusPage.updateMany(
      { orgId: data.orgId },
      { $pull: { monitors: data._id } }
    );
    await organizationService.deleteMonitor(data.orgId, data._id);
    await Monitor.findByIdAndDelete(data._id);

    // If in ActiveMonitor, delete ActiveMonitor
    const activeMonitorExists = await activeMonitorService.activeMonitorExists(
      monitorToDelete._id
    );
    if (activeMonitorExists) {
      try {
        await activeMonitorService.deleteActiveMonitor({
          monitorId: monitorToDelete._id,
          orgId: monitorToDelete.orgId,
        });
      } catch (error) {
        throw new Error("Failed to delete active monitor: " + error.message);
      }
    }

    return monitorToDelete;
  } catch (error) {
    throw new Error("Failed to delete monitor: " + error.message);
  }
};

module.exports = { getMonitors, createMonitor, updateMonitor, deleteMonitor };
