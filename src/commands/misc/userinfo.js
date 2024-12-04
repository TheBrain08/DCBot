const {
  Client,
  Interaction,
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user")?.value;
    const requestUser = interaction.user;
    let INFOuser;

    if (!targetUserId) {
      INFOuser = requestUser;
    } else {
      const targetMember = await interaction.guild.members.fetch(targetUserId);
      INFOuser = targetMember.user;
    }

    // Hole das Member-Objekt (guild-spezifische Infos) für den Benutzer
    const INFOmember = interaction.guild.members.cache.get(INFOuser.id);

    // send the information from a user
    try {
      const embed = new EmbedBuilder()
        .setTitle(`Userinfo from ${INFOuser.globalName}`)
        .setColor("#32CD32")
        .setFields(
          {
            name: "Name",
            value: "```" + INFOuser.globalName + "```",
            inline: true,
          },
          {
            name: "Nickname",
            value: "```" + (INFOmember.nickname || "No nickname") + "```",
            inline: true,
          },
          {
            name: "Bot",
            value: "```" + INFOuser.bot + "```",
            inline: true,
          },
          {
            name: "Joined server",
            value:
              "```" + new Date(INFOmember.joinedAt).toLocaleString() + "```",
            inline: true,
          },
          {
            name: "Joined discord",
            value:
              "```" + new Date(INFOuser.createdAt).toLocaleString() + "```",
            inline: true,
          },
          {
            name: "Roles",
            value: "```" + (INFOmember.roles.cache.size - 1) + "```",
            inline: true,
          },
          {
            name: "Highst roles",
            value: "```" + INFOmember.roles.highest.name + "```",
            inline: true,
          },
          {
            name: "Boosted",
            value: INFOmember.premiumSince ? "```true```" : "```false```",
            inline: true,
          }
        )
        .setThumbnail(INFOuser.displayAvatarURL({ dynamic: true, size: 128 }))
        .setTimestamp()
        .setFooter({
          text: `Requested by ${requestUser.globalName}`,
          iconURL: requestUser.displayAvatarURL({ dynamic: true, size: 128 }),
        });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(
        `There was an error trying to send the infofmation froam a user: ${error}`
      );
    }
  },

  name: "userinfo",
  description: "Shows information about a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to see the informations.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
