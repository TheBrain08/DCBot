const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const user = interaction.user;

    // send the help list
    try {
      const embed = new EmbedBuilder()
        .setTitle("Command list")
        .setDescription("Here you can find all commands")
        .setColor("#8518de")
        .addFields(
          // General commands
          { name: "For everyone", value: "\u200B", inline: false },
          {
            name: "help",
            value: "```Shows a list of all commands```",
            inline: true,
          },
          {
            name: "ping",
            value: "```Replies with the bot ping```",
            inline: true,
          },
          {
            name: "serverinfo",
            value: "```Shows information about this server```",
            inline: true,
          },
          {
            name: "userinfo",
            value: "```Shows information about a user```",
            inline: true,
          },

          // Moderation commands
          { name: "Moderation", value: "\u200B", inline: false },
          {
            name: "ban",
            value: "```Bans a member from this server.```",
            inline: true,
          },
          {
            name: "kick",
            value: "```Kicks a member from this server.```",
            inline: true,
          },
          { name: "timeout", value: "```Timeout a user```", inline: true },
          {
            name: "clear",
            value: "```Deletes amount of messages```",
            inline: true,
          },

          // Fun commands
          { name: "Fun stuff", value: "\u200B", inline: false },
          { name: "iq", value: "```Shows the iq of a user.```", inline: true },
          {
            name: "gay",
            value: "```Shows how gay a user is.```",
            inline: true,
          },
          {
            name: "micha",
            value: "```Beschreibt was Micha macht```",
            inline: true,
          },
          { name: "coin", value: "```Flips a coin.```", inline: true },
          { name: "dice", value: "```Throws a dice.```", inline: true }
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.globalName}`,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
        });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error trying to send the help list: ${error}`);
    }
  },

  name: "help",
  description: "Shows all commands.",
};
