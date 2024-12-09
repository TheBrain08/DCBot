const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");

const choices = [
  {
    name: "Rock",
    emoji: "🪨",
    beats: "Scissors",
  },
  {
    name: "Paper",
    emoji: "📄",
    beats: "Rock",
  },
  {
    name: "Scissors",
    emoji: "✂",
    beats: "Paper",
  },
];

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      const user = interaction.user;
      const targetUser = interaction.options.getUser("target-user");

      if (targetUser === user) {
        interaction.reply({
          content: "You cannot play with yourself",
          ephemeral: true,
        });
        return;
      }
      if (targetUser.bot) {
        interaction.reply({
          content: "You cannot play with a bot",
          ephemeral: true,
        });
        return;
      }
      const embed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors")
        .setDescription(`It's ${targetUser}'s turn.`)
        .setColor("#FFFF00")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.globalName}`,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
        });

      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setCustomId(choice.name)
          .setLabel(choice.name)
          .setStyle(ButtonStyle.Primary)
          .setEmoji(choice.emoji);
      });

      const row = new ActionRowBuilder().addComponents(buttons);

      const reply = await interaction.reply({
        content: `${targetUser} you have been challenged by ${user} to a Rock Paper Scissors game.`,
        embeds: [embed],
        components: [row],
      });
      const targetUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === targetUser.id,
          time: 30_000,
        })
        .catch(async (error) => {
          embed.setDescription(
            `Game over. ${targetUser} did not respond in time.`
          );
          await reply.edit({ embeds: [embed], components: [] });
        });

      if (!targetUserInteraction) return;

      const targetUserChoice = choices.find(
        (choice) => choice.name === targetUserInteraction.customId
      );

      await targetUserInteraction.reply({
        content: `You picked ${targetUserChoice.name + targetUserChoice.emoji}`,
        ephemeral: true,
      });

      embed.setDescription(`It's ${user}'s turn.`);
      await reply.edit({
        embeds: [embed],
      });

      const initialUserInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === user.id,
          time: 30_000,
        })
        .catch(async (error) => {
          embed.setDescription(`Game over. ${user} did not respond in time.`);
          await reply.edit({ embeds: [embed], components: [] });
        });

      if (!initialUserInteraction) return;

      const initialUserChoice = choices.find(
        (choice) => choice.name === initialUserInteraction.customId
      );

      let result;
      if (targetUserChoice.beats === initialUserChoice.name) {
        result = `${targetUser} won!`;
      }
      if (initialUserChoice.beats === targetUserChoice.name) {
        result = `${user} won!`;
      }
      if (targetUserChoice.name === initialUserChoice.name) {
        result = `It was a tie!`;
      }

      embed.setDescription(
        `${targetUser} picked ${
          targetUserChoice.name + targetUserChoice.emoji
        } \n ${user} picked ${
          initialUserChoice.name + initialUserChoice.emoji
        } \n\n${result}`
      );

      await reply.edit({ content: "", embeds: [embed], components: [] });
    } catch (error) {
      console.log(`There was an error trying to send the rps game: ${error}`);
    }
  },

  name: "rps",
  description: "Play a round of rock paper scissors.",
  options: [
    {
      name: "target-user",
      description: "The user you want to play with.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
};
