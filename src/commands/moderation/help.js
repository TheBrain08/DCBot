const {
  Client,
  Interaction,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
//const handleButtonInteractions = require("../../utils/handleButtonInteractions");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const user = interaction.user;
    const choices = [
      {
        id: "0",
        label: "previous",
        emoji: "⏮",
      },
      {
        id: "1",
        label: "next",
        emoji: "⏭",
      },
      {
        id: "2",
        label: "Admin",
        emoji: "⚠",
        style: ButtonStyle.Danger,
      },
    ];
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
          { name: "dice", value: "```Throws a dice.```", inline: true },

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
          {
            name: "welcomemessage-config",
            value: "```Setup the welcome message.```",
            inline: true,
          },
          {
            name: "welcomemessage-disable ",
            value: "```Disables the welcome message function.```",
            inline: true,
          },
          {
            name: "autorole-config",
            value: "```Setup the auto role fucntion.```",
            inline: true,
          },
          {
            name: "autorole-disable",
            value: "```Disables the auto role function.```",
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.globalName}`,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
        });

      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setCustomId(choice.id)
          .setLabel(choice.label)
          .setStyle(choice.style || ButtonStyle.Primary)
          .setEmoji(choice.emoji);
      });

      const row = new ActionRowBuilder().addComponents(buttons);

      //console.log("Interaction object:", interaction);
      const message = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });

      //console.log("Message returned from reply:", message);

      //await handleButtonInteractions(interaction, message);
    } catch (error) {
      console.log(`There was an error trying to send the help list: ${error}`);
    }
  },

  name: "help",
  description: "Shows all commands.",
};
