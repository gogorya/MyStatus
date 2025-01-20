const organizationService = require("./organizationService.js");

const StatusPage = require("../models/StatusPage.js");

const getStatusPages = async (orgId) => {
  try {
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
  } catch (error) {
    throw new Error("Failed to get status pages: " + error.message);
  }
};

const createStatusPage = async (data) => {
  try {
    const organizationExists = await organizationService.organizationExists(
      data.orgId
    );
    if (!organizationExists) {
      await organizationService.createOrganization(data.orgId);
    }
    const slugExists = await StatusPage.find({ slug: data.slug });
    if (slugExists.length !== 0) {
      throw new Error("Slug already exists");
    }

    const newStatusPage = new StatusPage(data);
    await newStatusPage.save();
    await organizationService.addStatusPage(data.orgId, newStatusPage._id);
    const savedStatusPage = await StatusPage.findById(newStatusPage._id)
      .select("-orgId -__v")
      .populate({
        path: "monitors",
        select: "name",
      });

    return savedStatusPage;
  } catch (error) {
    if (error.message === "Slug already exists") {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to create status page: " + error.message);
    }
  }
};

const updateStatusPage = async (data) => {
  try {
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
  } catch (error) {
    throw new Error("Failed to update status page: " + error.message);
  }
};

const deleteStatusPage = async (data) => {
  try {
    const statusPageToDelete = await StatusPage.findById(data._id);
    if (
      statusPageToDelete.orgId.toString() !== data.orgId.toString() ||
      statusPageToDelete._id.toString() !== data._id.toString()
    ) {
      throw new Error("Unauthorized");
    }

    await organizationService.deleteStatusPage(data.orgId, data._id);
    await StatusPage.findByIdAndDelete(data._id);

    return statusPageToDelete;
  } catch (error) {
    throw new Error("Failed to delete status page: " + error.message);
  }
};

module.exports = {
  getStatusPages,
  createStatusPage,
  updateStatusPage,
  deleteStatusPage,
};
