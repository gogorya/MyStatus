const mongoose = require("mongoose");

const activeMonitorDataSchema = new mongoose.Schema({
  id: {
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

// Add it later in checkStatus
activeMonitorDataSchema.methods.removeOldRecords = async function () {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  this.data = this.data.filter((record) => record.date >= sixMonthsAgo);
  await this.save();
};

const ActiveMonitorData = mongoose.model(
  "ActiveMonitorData",
  activeMonitorDataSchema
);
module.exports = ActiveMonitorData;
