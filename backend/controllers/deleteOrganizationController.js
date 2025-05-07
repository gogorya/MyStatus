const { Webhook } = require("svix");

const deleteOrganizationService = require("../services/deleteOrganizationService.js");

const deleteOrganization = async (req, res) => {
  try {
    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(process.env.SVIX_WEBHOOK_SECRET);
    let msg;
    try {
      msg = wh.verify(JSON.stringify(payload), headers);
    } catch (error) {
      throw error;
    }

    await deleteOrganizationService.deleteOrganization({
      orgId: msg.data.id,
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete Organization",
      error: error.message,
    });
  }
};

module.exports = { deleteOrganization };
