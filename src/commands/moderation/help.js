const {
  Client,
  Interaction,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

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
        label: "All",
        style: ButtonStyle.Success,
      },
      {
        id: "1",
        label: "Moderation",
        style: ButtonStyle.Primary,
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
        .setDescription("Here you can find all commands for users")
        .setColor("#8518de")
        .setFields(
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
          {
            name: "minecraft",
            value:
              "```Shows you how to get to the <#1166768191427575808> channel```",
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
          { name: "Games", value: "\u200B", inline: false },
          {
            name: "rps",
            value: "```Play a round of Rock Paper Scissors.```",
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.globalName}`,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
        });

      const buttons = choices.map((choice) => {
        const button = new ButtonBuilder()
          .setCustomId(choice.id)
          .setLabel(choice.label)
          .setStyle(choice.style || ButtonStyle.Primary);

        if (choice.emoji) {
          button.setEmoji(choice.emoji);
        }

        return button; // Der Button wird erst hier zurückgegeben
      });

      const row = new ActionRowBuilder().addComponents(buttons);

      //console.log("Interaction object:", interaction);
      const message = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true,
      });
    } catch (error) {
      console.log(`There was an error trying to send the help list: ${error}`);
    }
  },

  name: "help",
  description: "Shows all commands.",
};
