const {
  Client,
  Interaction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChannelType,
} = require("discord.js");
const JTC = require("../../models/JTC");

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

    const targetCategoryId = interaction.options.get("category").value;
    const roleInput = interaction.options.get("roles")?.value; // Eingabe der Rollen als String

    const roleIds = roleInput
      ? roleInput.split(",").map((role) => role.trim())
      : []; // Trenne Eingabe in eine Liste von IDs

    if (roleIds.length > 10) {
      interaction.reply("You can only specify up to 10 roles.");
      return;
    }

    // Überprüfe, ob jede Rolle gültig ist
    const roles = roleIds
      .map((id) => interaction.guild.roles.cache.get(id))
      .filter((role) => role);

    try {
      await interaction.deferReply();

      let jTC = await JTC.findOne({
        guildId: interaction.guild.id,
      });

      if (jTC) {
        interaction.editReply("Join to create Channel already exists");
      } else {
        // Erstelle den Voice Channel
        const channel = await interaction.guild.channels.create({
          name: "Join to create",
          type: ChannelType.GuildVoice,
          parent: targetCategoryId,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              allow: [PermissionFlagsBits.Connect],
            },
          ],
        });

        interaction.editReply(
          "Join to create Channel has been created. Use `/disable-jtc` to disable and delete the Join to create channel"
        );

        // Speichern der Rollen in der Datenbank
        jTC = new JTC({
          guildId: interaction.guild.id,
          categoryId: targetCategoryId,
          channelId: channel.id,
          roles: roles.map((role) => role.id), // Speichere die Rollen-IDs
        });

        await jTC.save();
      }
    } catch (error) {
      console.log(`Error while trying to configure jtc: ${error}`);
    }
  },

  name: "setup-jtc",
  description: "Setup a join to create voice channel.",
  options: [
    {
      name: "category",
      description:
        "The channel category where join-to-create channels will be created",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildCategory],
      required: true,
    },
    {
      name: "roles",
      description:
        "Comma-separated list of role IDs to save in the database (max 10)",
      type: ApplicationCommandOptionType.String, // Eingabe als String-Liste
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
