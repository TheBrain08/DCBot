const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const WelcomeMessage = require("../../models/WelcomeMessage");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    const targetChannelId = interaction.options.get("channel").value;
    const customMessage = interaction.options.get("message")?.value;

    try {
      await interaction.deferReply();

      let welcomeMessage = await WelcomeMessage.findOne({
        guildId: interaction.guild.id,
      });

      if (welcomeMessage) {
        welcomeMessage.channelId = targetChannelId;
        welcomeMessage.customMessage = customMessage || null;
      } else {
        welcomeMessage = new WelcomeMessage({
          guildId: interaction.guild.id,
          channelId: targetChannelId,
          customMessage: customMessage || null,
        });
      }

      await welcomeMessage.save();
      interaction.editReply(
        `Welcome message has now been configured for <#${targetChannelId}>.${
          customMessage
            ? " Custom message has been set."
            : " Default message will be used."
        } To disable, run \`/welcomemessage-disable\`.`
      );
    } catch (error) {
      console.log(`Error in welcome message config: ${error}`);
      interaction.editReply(
        "There was an error while configuring the welcome message."
      );
    }
  },

  name: "welcomemessage-config",
  description: "Configure your welcome message",
  options: [
    {
      name: "channel",
      description: "The channel where the welcome messages will be sent",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "message",
      description:
        "The custom welcome message to send (TEMPLATE: ${member} = username ${guild.name})",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
