const StatusPage = require("../models/StatusPage.js");
const organizationService = require("./organizationService.js");

const getStatusPages = async (orgId) => {
  const statusPageIds = await organizationService.getStatusPages(orgId);
  const statusPages = await StatusPage.find({
    _id: { $in: statusPageIds },
  })
    .select("-orgId -__v")
    .populate({
      path: "monitors",
      select: "name",
    });
  return statusPages;
};

const createStatusPage = async (data) => {
  const organizationExists = await organizationService.organizationExists(
    data.orgId
  );
  if (!organizationExists) {
    await organizationService.createOrganization(data.orgId);
  }

  const newStatusPage = new StatusPage(data);
  await newStatusPage.save();
  organizationService.addStatusPage(data.orgId, newStatusPage._id);
  const savedStatusPage = await StatusPage.findById(newStatusPage._id)
    .select("-orgId -__v")
    .populate({
      path: "monitors",
      select: "name",
    });
  return savedStatusPage;
};

const updateStatusPage = async (data) => {
  const statusPageToUpdate = await StatusPage.findById(data._id);
  if (
    statusPageToUpdate.orgId.toString() !== data.orgId.toString() ||
    statusPageToUpdate._id.toString() !== data._id.toString()
  ) {
    throw new Error("Unauthorized");
  }
  Object.assign(statusPageToUpdate, data);
  await statusPageToUpdate.save();
  const updatedStatusPage = await StatusPage.findById(data._id)
    .select("-orgId -__v")
    .populate({
      path: "monitors",
      select: "name",
    });
  return updatedStatusPage;
};

const deleteStatusPage = async (data) => {
  const statusPageToDelete = await StatusPage.findById(data._id);
  if (
    statusPageToDelete.orgId.toString() !== data.orgId.toString() ||
    statusPageToDelete._id.toString() !== data._id.toString()
  ) {
    throw new Error("Unauthorized");
  }
  organizationService.deleteStatusPage(data.orgId, data._id);
  await StatusPage.findByIdAndDelete(data._id);
  return statusPageToDelete;
};

module.exports = {
  getStatusPages,
  createStatusPage,
  updateStatusPage,
  deleteStatusPage,
};
