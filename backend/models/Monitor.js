const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,}(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Monitor = mongoose.model("Monitor", monitorSchema);
module.exports = Monitor;
