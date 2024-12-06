const { Client, Interaction, PermissionFlagsBits } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const existingAutoRole = await AutoRole.findOne({
        guildId: interaction.guild.id,
      });
      if (!existingAutoRole) {
        interaction.editReply(
          "Auto roles have not been configured for this server. Use `/autorole-config` to set them up."
        );
        return;
      }

      await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply(
        "Auto roles have been disabled for this server. Use `/autorole-config` to set them up again."
      );
    } catch (error) {
      console.log(`Error while trying to disable auto roles: ${error}`);
      interaction.editReply(
        "There was an error while disabling the auto roles."
      );
    }
  },

  name: "autorole-disable",
  description: "Disable auto roles.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
