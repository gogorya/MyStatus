const mongoose = require("mongoose");

const activeMonitorSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    immutable: true,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
    unique: true,
    immutable: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const ActiveMonitor = mongoose.model("ActiveMonitor", activeMonitorSchema);
module.exports = ActiveMonitor;
