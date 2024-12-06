const { Schema, model } = require("mongoose");

const autoRoleSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  roleOneId: {
    type: String,
    required: true,
  },
  roleTwoId: {
    type: String,
    required: false,
  },
});

module.exports = model("AutoRole", autoRoleSchema);
