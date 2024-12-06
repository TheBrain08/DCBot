const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const AutoRole = require("../../models/AutoRole");

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

    const roleOneId = interaction.options.get("roleone").value;
    const roleTwoId = interaction.options.get("roletwo")?.value || null;

    try {
      await interaction.deferReply();

      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        if (!roleTwoId) {
          autoRole.roleTwoId = undefined;
        } else {
          autoRole.roleTwoId = roleTwoId;
        }

        autoRole.roleOneId = roleOneId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleOneId,
          roleTwoId,
        });
      }

      await autoRole.save();

      if (roleTwoId) {
        interaction.editReply(
          `Auto roles have been set. Role One: <@&${roleOneId}>, Role Two: <@&${roleTwoId}>`
        );
      } else {
        interaction.editReply(
          `Auto roles have been set. Role One: <@&${roleOneId}>. Role Two has been disabled.`
        );
      }
    } catch (error) {
      console.log(`Error configuring auto roles: ${error}`);
      interaction.editReply(
        "There was an error while setting up the auto roles."
      );
    }
  },

  name: "autorole-config",
  description: "Configure auto roles for new members.",
  options: [
    {
      name: "roleone",
      description: "The first role to assign to new members.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "roletwo",
      description: "The second role to assign to new members (optional).",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
