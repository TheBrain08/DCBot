const { Client, Interaction, PermissionFlagsBits } = require("discord.js");
const JTC = require("../../models/JTC");

module.exports = {
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const existingjTC = await JTC.findOne({
        guildId: interaction.guild.id,
      });
      if (!existingjTC) {
        interaction.editReply(
          "JTC have not been configured for this server. Use `/setup-jtc` to set them up."
        );
        return;
      }
      const channel = await interaction.guild.channels.fetch(
        existingjTC.channelId
      );
      await channel.delete();

      await JTC.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply(
        "JTC have been disabled for this server. Use `/setup-jtc` to set them up again."
      );
    } catch (error) {
      console.log(`Error while trying to disable jtc: ${error}`);
    }
  },

  name: "disable-jtc",
  description: "Disable the Join to create channel.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
