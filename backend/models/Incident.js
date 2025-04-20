const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Investigating", "Identified", "Monitoring", "Resolved"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const incidentSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
  },
  monitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
    immutable: true,
  },
  statusHistory: {
    type: [statusSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

incidentSchema.pre("save", function (next) {
  if (this.isModified("statusHistory") || this.isModified("name")) {
    const lastStatus =
      this.statusHistory[
        this.statusHistory.length - (this.isModified("statusHistory") ? 2 : 1)
      ];

    if (lastStatus && lastStatus.status === "Resolved") {
      const error = new Error("Cannot modify a resolved incident");
      return next(error);
    }
  }
  next();
});

incidentSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.orgId;
    ret.statusHistory.reverse();
    return ret;
  },
});

const Incident = mongoose.model("Incident", incidentSchema);

module.exports = Incident;
