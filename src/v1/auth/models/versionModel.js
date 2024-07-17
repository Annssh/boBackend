const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    version: {
        type: Number,
        default: 1,
        required: true
    }
  },
);

const Version = mongoose.model("Version", versionSchema);

module.exports = Version;
