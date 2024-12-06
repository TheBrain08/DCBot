const { Client, GuildMember } = require("discord.js");
const WelcomeMessage = require("../../models/WelcomeMessage");

/**
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    const guild = member.guild;
    const welcomeMessage = await WelcomeMessage.findOne({ guildId: guild.id });

    if (!welcomeMessage) {
      console.log("No welcome message channel configured for this guild.");
      return;
    }

    const channelId = welcomeMessage.channelId;
    const channel = guild.channels.cache.get(channelId);

    if (!channel) {
      console.log(`Channel with ID ${channelId} wasn't found.`);
      return;
    }

    const customMessage =
      welcomeMessage.customMessage ||
      "${member} willkommen auf dem ${guild.name} Server! 🎉";

    // Ersetze Platzhalter
    const formattedMessage = customMessage
      .replace(/\${member}/g, member)
      .replace(/\${guild\.name}/g, guild.name);

    await channel.send(formattedMessage);
  } catch (error) {
    console.log("Error while trying to send welcome message:", error);
  }
};
