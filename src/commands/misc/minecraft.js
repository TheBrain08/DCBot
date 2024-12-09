const {
  Client,
  Interaction,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const user = interaction.user;

    try {
      const embed = new EmbedBuilder()
        .setTitle("Minecraft Server")
        .setDescription(
          "Hey wir haben ein Minecraft Server falls du interesse hast klicke gerne auf den Button und du siehst den <#1166768191427575808> Channel"
        )
        .setColor("#00FF51")
        .setTimestamp()
        .setFooter({
          text: `Requested by ${user.globalName}`,
          iconURL: user.displayAvatarURL({ dynamic: true, size: 128 }),
        });

      const btn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("minecraft")
          .setLabel("Minecraft")
          .setStyle(ButtonStyle.Success)
      );

      await interaction.reply({
        embeds: [embed],
        components: [btn],
      });
    } catch (error) {
      console.log(
        `There was an error trying to send the minecraft embed. Error: ${error}`
      );
    }
  },
  name: "mineraft",
  description: "...",
};
