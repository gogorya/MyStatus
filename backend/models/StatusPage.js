const mongoose = require("mongoose");

const statusPageSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
    immutable: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  monitors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
    },
  ],
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

statusPageSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.orgId;
    return ret;
  },
});

const StatusPage = mongoose.model("StatusPage", statusPageSchema);

module.exports = StatusPage;
