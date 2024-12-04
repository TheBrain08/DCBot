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
    let GAYuser;
    if (!targetUserId) {
      GAYuser = requestUser.id;
    } else {
      GAYuser = targetUserId;
    }

    // send the iq from a user
    try {
      const embed = new EmbedBuilder()
        .setTitle("GAY Test")
        .setDescription(
          "🏳️‍🌈 Der IQ von <@" +
            GAYuser +
            "> `" +
            (Math.floor(Math.random() * 100) + 1) +
            "`%"
        )
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${requestUser.globalName}`,
          iconURL: requestUser.displayAvatarURL({ dynamic: true, size: 128 }),
        });
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(
        `There was an error trying to send the gay% from some user: ${error}`
      );
    }
  },

  name: "gay",
  description: "Shows how gay a user is.",
  options: [
    {
      name: "target-user",
      description: "The user whose gay is measured.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
