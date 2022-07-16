const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SessionSchema = Schema(
  {
    _id: String,
    expires: Date,
    session: String,
  },
  { timestamps: true }
);
const SessionModel = mongoose.model("session", SessionSchema);
module.exports = SessionModel;
