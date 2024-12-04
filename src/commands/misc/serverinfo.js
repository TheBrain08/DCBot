const {
  Client,
  Interaction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  Guild,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const requstUser = interaction.user;
    const guild = interaction.guild;
    // send the iq from a user
    try {
      const embed = new EmbedBuilder()
        .setTitle(`Serverinfo from ${Guild.name}`)
        .setColor("#1040eb")
        .setFields(
          {
            name: "Name",
            value: "```" + guild.name + "```",
            inline: true,
          },
          {
            name: "Server Members",
            value: "```" + guild.memberCount + "```",
            inline: true,
          },
          {
            name: "Bots",
            value:
              "```" +
              (guild.members.cache.filter((member) => member.user.bot).size +
                1) +
              "```",
            inline: true,
          },
          {
            name: "Server created at",
            value:
              "```" + new Date(guild.createdTimestamp).toLocaleString() + "```",
            inline: true,
          }
        )
        .setThumbnail(guild.iconURL({ dynamic: true, size: 128 }))
        .setTimestamp()
        .setFooter({
          text: `Requested by ${requstUser.globalName}`,
          iconURL: requstUser.displayAvatarURL({ dynamic: true, size: 128 }),
        });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(
        `There was an error trying to send the server information: ${error}`
      );
    }
  },

  name: "serverinfo",
  description: "Shows information about this server.",
};
