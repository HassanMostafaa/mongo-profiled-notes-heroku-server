const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    notes: { type: [Schema.Types.Mixed], required: true },
   
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
