const statusPageService = require("../services/statusPageService");

const getStatusPages = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const statusPages = await statusPageService.getStatusPages(orgId);
    res.status(200).json({ data: { statusPages } });
  } catch (error) {
    res.status(500).json({
      message: "Unable to get status pages",
      error: error.message,
    });
  }
};

const createStatusPage = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const data = { orgId, ...req.body.data };
    const createdStatusPage = await statusPageService.createStatusPage(data);
    res.status(201).json({
      data: {
        statusPage: createdStatusPage,
      },
    });
  } catch (error) {
    if (error.message === "Slug already exists") {
      res.status(201).json({
        message: "The slug already exists, please try with another name",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Unable to create status page",
        error: error.message,
      });
    }
  }
};

const updateStatusPage = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const data = { orgId, ...req.body.data };
    const updatedStatusPage = await statusPageService.updateStatusPage(data);
    res.status(201).json({
      data: {
        statusPage: updatedStatusPage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update status page",
      error: error.message,
    });
  }
};

const deleteStatusPage = async (req, res) => {
  try {
    const { orgId } = req.auth;
    const { _id } = req.body.data;
    const data = { orgId, _id };
    const deletedStatusPage = await statusPageService.deleteStatusPage(data);
    res.status(201).json({
      data: {
        statusPage: deletedStatusPage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete status page",
      error: error.message,
    });
  }
};

module.exports = {
  getStatusPages,
  createStatusPage,
  updateStatusPage,
  deleteStatusPage,
};
