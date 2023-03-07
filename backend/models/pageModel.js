const mongoose = require("mongoose");

const pageSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pages: {
      type: [String],
    }
  });
  
  module.exports = mongoose.model("Page", pageSchema);