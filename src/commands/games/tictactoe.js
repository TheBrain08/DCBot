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
  { id: "ttt0", label: "\u200B", emoji: "" },
  { id: "ttt1", label: "\u200B", emoji: "" },
  { id: "ttt2", label: "\u200B", emoji: "" },
  { id: "ttt3", label: "\u200B", emoji: "" },
  { id: "ttt4", label: "\u200B", emoji: "" },
  { id: "ttt5", label: "\u200B", emoji: "" },
  { id: "ttt6", label: "\u200B", emoji: "" },
  { id: "ttt7", label: "\u200B", emoji: "" },
  { id: "ttt8", label: "\u200B", emoji: "" },
];

let turn = "⭕";
let winner;

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
        return interaction.reply({
          content: "You cannot play with yourself.",
          ephemeral: true,
        });
      }
      if (targetUser.bot) {
        return interaction.reply({
          content: "You cannot play with a bot.",
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("Tic Tac Toe")
        .setDescription(`It's ${targetUser}'s turn.`)
        .setFields({
          name: "\u200B",
          value: `\`\`\`
                 |   |  
              ---+---+--- 
                 |   |  
              ---+---+--- 
                 |   |   \`\`\` `,
        })
        .setColor("#FFFF00")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.globalName}`,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
        });

      const buttons = choices.map((choice) => {
        const button = new ButtonBuilder()
          .setCustomId(choice.id)
          .setStyle(ButtonStyle.Primary);

        if (choice.emoji) {
          button.setEmoji(choice.emoji);
        } else {
          button.setLabel(choice.label);
        }

        return button;
      });

      const rows = [];
      while (buttons.length > 0) {
        rows.push(new ActionRowBuilder().addComponents(buttons.splice(0, 3)));
      }

      // Defer the response to give time for interaction
      await interaction.deferReply();

      const reply = await interaction.editReply({
        content: `${targetUser} you have been challenged by ${user} to a Tic Tac Toe game.`,
        embeds: [embed],
        components: rows,
      });

      // Function to check for winner
      function checkWin(rows) {
        const winningCombinations = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8], // Rows
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8], // Columns
          [0, 4, 8],
          [2, 4, 6], // Diagonals
        ];

        for (const combination of winningCombinations) {
          const [a, b, c] = combination;

          const buttonA =
            rows[Math.floor(a / 3)].components[a % 3].data.emoji?.name;
          const buttonB =
            rows[Math.floor(b / 3)].components[b % 3].data.emoji?.name;
          const buttonC =
            rows[Math.floor(c / 3)].components[c % 3].data.emoji?.name;

          if (buttonA && buttonA === buttonB && buttonA === buttonC) {
            return buttonA;
          }
        }

        return null;
      }

      // Game loop
      while (!winner) {
        let targetUserInteraction;
        try {
          targetUserInteraction = await reply.awaitMessageComponent({
            filter: (i) => i.user.id === targetUser.id,
            time: 30_000,
          });
        } catch (error) {
          embed.setDescription(
            `Game over. ${targetUser} did not respond in time.`
          );
          await reply.edit({ embeds: [embed], components: [] });
          return;
        }

        if (!targetUserInteraction) {
          console.log("No interaction from target user.");
          return;
        }

        const targetUserChoice = choices.find(
          (choice) => choice.id === targetUserInteraction.customId
        );

        // Mark the button with the user's emoji and disable it
        for (let i = 0; i < rows.length; i++) {
          for (let x = 0; x < rows[i].components.length; x++) {
            if (rows[i].components[x].data.custom_id === targetUserChoice.id) {
              rows[i].components[x] = new ButtonBuilder()
                .setCustomId(targetUserChoice.id)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji(turn);
            }
          }
        }

        // Check if the target user has won
        winner = checkWin(rows);
        if (winner) {
          embed.setDescription(`${targetUser} wins with ${winner}!`);
          break;
        }

        turn = "❌"; // Switch turn to the next player
        embed.setDescription(`It's ${user}'s turn.`);
        await reply.edit({ embeds: [embed], components: rows });

        let initialUserInteraction;
        try {
          initialUserInteraction = await reply.awaitMessageComponent({
            filter: (i) => i.user.id === user.id,
            time: 30_000,
          });
        } catch (error) {
          embed.setDescription(`Game over. ${user} did not respond in time.`);
          await reply.edit({ embeds: [embed], components: [] });
          return;
        }

        if (!initialUserInteraction) {
          console.log("No interaction from initial user.");
          return;
        }

        const initialUserChoice = choices.find(
          (choice) => choice.id === initialUserInteraction.customId
        );

        // Mark the button with the user's emoji and disable it
        for (let i = 0; i < rows.length; i++) {
          for (let x = 0; x < rows[i].components.length; x++) {
            if (rows[i].components[x].data.custom_id === initialUserChoice.id) {
              rows[i].components[x] = new ButtonBuilder()
                .setCustomId(initialUserChoice.id)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji(turn);
            }
          }
        }

        // Check if the initial user has won
        winner = checkWin(rows);
        if (winner) {
          embed.setDescription(`${user} wins with ${winner}!`);
          break;
        }

        turn = "⭕"; // Switch turn back to target user
        embed.setDescription(`It's ${targetUser}'s turn.`);
        await reply.edit({ embeds: [embed], components: rows });
      }

      // Final winner announcement
      await reply.edit({
        embeds: [embed],
        components: [],
      });
    } catch (error) {
      console.log(`Error occurred: ${error}`);
      if (interaction.deferred) {
        await interaction.editReply({
          content: "An error occurred while processing the game.",
        });
      } else {
        await interaction.reply({
          content: "An error occurred while processing the game.",
          ephemeral: true,
        });
      }
    }
  },

  name: "tic-tac-toe",
  description: "Play a round of tic tac toe.",
  options: [
    {
      name: "target-user",
      description: "The user you want to play with.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
};
