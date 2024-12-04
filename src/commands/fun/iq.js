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
    let IQuser;
    if (!targetUserId) {
      IQuser = requestUser.id;
    } else {
      IQuser = targetUserId;
    }

    // send the iq from a user
    try {
      const embed = new EmbedBuilder()
        .setTitle("IQ Test🧠")
        .setDescription(
          "💡 Der IQ von <@" +
            IQuser +
            "> `" +
            (Math.floor(Math.random() * 228) + 1) +
            "`"
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
        `There was an error trying to send the iq from some user: ${error}`
      );
    }
  },

  name: "iq",
  description: "Shows the is of a user.",
  options: [
    {
      name: "target-user",
      description: "The user whose IQ is to be determined.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
