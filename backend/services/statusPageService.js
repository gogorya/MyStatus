const StatusPage = require("../models/StatusPage.js");

const getStatusPages = async (orgId) => {
  try {
    const statusPages = await StatusPage.find({ orgId: orgId }).populate(
      "monitors"
    );
    return statusPages;
  } catch (error) {
    throw new Error("Failed to get status pages: " + error.message);
  }
};

const createStatusPage = async (data) => {
  try {
    const slugExists = await StatusPage.find({ slug: data.slug });
    if (slugExists.length !== 0) {
      throw new Error("Slug already exists");
    }
    data.monitors = [...new Set(data.monitors)];

    const newStatusPage = new StatusPage(data);
    await newStatusPage.save();
    await newStatusPage.populate("monitors");

    return newStatusPage;
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
    data.monitors = [...new Set(data.monitors)];

    Object.assign(statusPageToUpdate, data);
    await statusPageToUpdate.save();
    await statusPageToUpdate.populate("monitors");

    return statusPageToUpdate;
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

    const deletedStatusPage = await StatusPage.findByIdAndDelete(
      data._id
    ).populate("monitors");

    return deletedStatusPage;
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
