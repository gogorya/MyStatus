const statusPagePublicService = require("../services/statusPagePublicService");

const getStatusPagePublic = async (req, res) => {
  try {
    const slug = req.params.slug;
    const statusPagePublic = await statusPagePublicService.getStatusPagePublic(
      slug
    );
    res.status(200).json({ data: { statusPagePublic } });
  } catch (error) {
    if (error.message === "Status page not found") {
      res.status(404).json({
        message: "This page does not exist",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Unable to get status page public",
        error: error.message,
      });
    }
  }
};

module.exports = { getStatusPagePublic };
