require("dotenv").config();
const { Client, IntentsBitField, ActivityType } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  c.user.setActivity("mit Micha`s kleinen", { type: ActivityType.Playing });
});

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

/**
 eventHandler(client);
 client.login(process.env.TOKEN);
 */

// Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
