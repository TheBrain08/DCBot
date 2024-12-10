const { devs, testServer } = require("../../../config.json");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = async (client, interaction) => {
  try {
    if (interaction.isButton()) {
      const user = interaction.user;

      let newEmbed;
      const sendHelpEmbed = async (embed) => {
        await interaction.update({ embeds: [embed] });
      };

      const sendRPSEmbed = async (embed, components) => {
        if (components) {
          await interaction.update({
            embeds: [embed],
            components: [components],
          });
        } else {
          await interaction.update({ embeds: [embed] });
        }
      };

      if (interaction.customId === "0") {
        newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
          .setDescription("Here you can find all commands for users")
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
                "```This shows you how to get into the Minecraft channel```",
              inline: true,
            },

            // Fun commands
            { name: "Fun stuff", value: "\u200B", inline: false },
            {
              name: "iq",
              value: "```Shows the iq of a user.```",
              inline: true,
            },
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
        await sendHelpEmbed(newEmbed);
      } else if (interaction.customId === "1") {
        newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
          .setDescription("Here you can find all commands for the games")
          .setFields(
            { name: "Games", value: "\u200B", inline: false },
            {
              name: "rps",
              value: "```Play a round of Rock Paper Scissors.```",
              inline: true,
            },
            {
              name: "tic-tac-toe",
              value: "```Play a round of Tic Tac Toe.```",
              inline: true,
            }
          )
          .setTimestamp()
          .setFooter({
            text: `Requested by ${user.globalName}`,
            iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
          });
        await sendHelpEmbed(newEmbed);
      } else if (interaction.customId === "2") {
        newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
          .setDescription("Here you can find all commands for moderation")
          .setFields(
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
            }
          )
          .setTimestamp()
          .setFooter({
            text: `Requested by ${user.globalName}`,
            iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
          });
        await sendHelpEmbed(newEmbed);
      } else if (interaction.customId === "3") {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        ) {
          await interaction.reply({
            content: `Du hast nicht die benötigten Rechte hierfür`,
            ephemeral: true,
          });
        } else {
          newEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription("Here you can find all commands for administartion")
            .setFields(
              // Admin commands
              { name: "Admin", value: "\u200B", inline: false },
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
              },
              {
                name: "setup-jtc",
                value: "```Setup a Join to create channel.```",
                inline: true,
              },
              {
                name: "disable-jtc",
                value: "```Disables the Join to create channel.```",
                inline: true,
              }
            )
            .setTimestamp()
            .setFooter({
              text: `Requested by ${user.globalName}`,
              iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
            });
          await sendHelpEmbed(newEmbed);
        }
      } else if (interaction.customId === "minecraft") {
        const minecraftRole = "1166767700106813510";
        const hasRole = interaction.member.roles.cache.has(minecraftRole);

        if (hasRole) {
          await interaction.member.roles.remove(minecraftRole);
          await interaction.reply({
            content: `Dir wurde die Rolle <@&${minecraftRole}> entfernt.`,
            ephemeral: true,
          });
        } else {
          await interaction.member.roles.add(minecraftRole);
          await interaction.reply({
            content: `Dir wurde die Rolle <@&${minecraftRole}> hinzugefügt.`,
            ephemeral: true,
          });
        }
      } else if (
        interaction.customId === "Rock" ||
        interaction.customId === "Paper" ||
        interaction.customId === "Scissors"
      ) {
        return;
      } else if (
        interaction.customId === "ttt0" ||
        interaction.customId === "ttt1" ||
        interaction.customId === "ttt2" ||
        interaction.customId === "ttt3" ||
        interaction.customId === "ttt4" ||
        interaction.customId === "ttt5" ||
        interaction.customId === "ttt6" ||
        interaction.customId === "ttt7" ||
        interaction.customId === "ttt8"
      ) {
        return;
      }
    }
  } catch (error) {
    console.log(`There was an error handling the interaction: ${error}`);
  }
};
