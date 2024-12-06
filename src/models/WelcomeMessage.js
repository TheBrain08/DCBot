const { Schema, model } = require("mongoose");

const welcomeMessageSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  customMessage: {
    type: String,
    default: null,
  },
});

module.exports = model("WelcomeMessage", welcomeMessageSchema);
