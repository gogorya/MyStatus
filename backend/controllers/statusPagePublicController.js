const statusPagePublicService = require("../services/statusPagePublicService");

const getStatusPagePublic = async (req, res) => {
  try {
    const { slug } = req.body.data;
    const statusPagePublic = await statusPagePublicService.getStatusPagePublic(
      slug
    );
    res.status(201).json({ data: { statusPagePublic } });
  } catch (error) {
    console.log("bad: ", error);
    res.status(500).json({
      message: "Unable to get status page public",
      error: error.message,
    });
  }
};

module.exports = { getStatusPagePublic };
