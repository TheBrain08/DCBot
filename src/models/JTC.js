const { Schema, model } = require("mongoose");

const jTCSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String, // Eine Liste von Rollen-IDs, die besondere Rechte im Channel haben sollen
    },
  ],
});

module.exports = model("JTC", jTCSchema);
