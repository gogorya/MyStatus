const mongoose = require("mongoose");

const activeMonitorDataSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    immutable: true,
  },
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
    unique: true,
    immutable: true,
  },
  data: [
    {
      date: {
        type: Date,
        required: true,
      },
      success: {
        type: Number,
        required: true,
        default: 0,
      },
      fail: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

const ActiveMonitorData = mongoose.model(
  "ActiveMonitorData",
  activeMonitorDataSchema
);

module.exports = ActiveMonitorData;
