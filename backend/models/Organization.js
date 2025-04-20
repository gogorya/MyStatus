const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
