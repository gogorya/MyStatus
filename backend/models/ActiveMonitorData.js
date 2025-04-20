const mongoose = require("mongoose");

const activeMonitorDataSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    immutable: true,
  },
  monitor: {
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

activeMonitorDataSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.orgId;
    return ret;
  },
});

const ActiveMonitorData = mongoose.model(
  "ActiveMonitorData",
  activeMonitorDataSchema
);

module.exports = ActiveMonitorData;
