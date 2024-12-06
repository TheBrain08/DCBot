const { Client, Interaction, PermissionFlagsBits } = require("discord.js");
const WelcomeMessage = require("../../models/WelcomeMessage");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await WelcomeMessage.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply(
          "Welcome message has not been configured for this server. Use `/welcomemessage-config` to set it up."
        );
        return;
      }

      await WelcomeMessage.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply(
        "Welcome message has not been disabled for this server. Use `/welcomemessage-config` to set it up again."
      );
    } catch (error) {
      console.log(
        `There was an error while trying to disable a welcome message. Error: ${error}`
      );
    }
  },
  name: "welcomemessage-disable",
  description: "disable welcome message.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
