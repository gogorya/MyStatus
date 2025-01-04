const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    unique: true,
  },
  monitors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
    },
  ],
  statusPages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StatusPage",
    },
  ],
});

const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;
