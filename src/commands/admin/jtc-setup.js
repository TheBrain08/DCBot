const {
  Client,
  Interaction,
  PermissionFlagsBits,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
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
      await interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    let selectedCategories = [];
    let selectedRoles = [];
    let msgToDelete = [];
    let msg;

    // Channel Selection Menu
    const categoryMenu = new ChannelSelectMenuBuilder()
      .setCustomId(`${interaction.id}-channel`)
      .setMinValues(1) // Benutzer muss mindestens eine Kategorie auswählen
      .setMaxValues(3)
      .setChannelTypes(ChannelType.GuildCategory);

    const actionRowOne = new ActionRowBuilder().setComponents(categoryMenu);

    // Send the first menu
    msg = await interaction.reply({
      content: "Please select a category for the Join-to-Create channel.",
      components: [actionRowOne],
      fetchReply: true,
    });
    msgToDelete.push(msg);

    const collectorOne = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.ChannelSelect,
      filter: (i) =>
        i.user.id === interaction.user.id &&
        i.customId === `${interaction.id}-channel`,
      time: 60_000,
    });

    collectorOne.on("collect", async (i) => {
      selectedCategories = i.values;

      if (!selectedCategories[0]) {
        await i.reply({
          content: "You must select at least one category.",
          ephemeral: true,
        });
        return;
      }

      msg = await i.reply({
        content: `You have selected categories: ${selectedCategories.join(
          ", "
        )}`,
      });
      msgToDelete.push(msg);

      // Role Selection Menu
      const roleMenu = new RoleSelectMenuBuilder()
        .setCustomId(`${interaction.id}-role`)
        .setMinValues(0)
        .setMaxValues(3);

      const actionRowTwo = new ActionRowBuilder().setComponents(roleMenu);

      // Follow-up with the second menu
      msg = await interaction.followUp({
        content: "Now select roles that can use the Join-to-Create channel.",
        components: [actionRowTwo],
      });
      msgToDelete.push(msg);

      const collectorTwo = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.RoleSelect,
        filter: (j) =>
          j.user.id === interaction.user.id &&
          j.customId === `${interaction.id}-role`,
        time: 60_000,
      });

      collectorTwo.on("collect", async (j) => {
        selectedRoles = j.values;

        msg = await j.reply({
          content: `You have selected roles: ${selectedRoles.join(", ")}`,
        });
        msgToDelete.push(msg);

        // Prüfen, ob `categoryId` vorhanden ist
        if (!selectedCategories[0]) {
          await interaction.followUp({
            content: "Category selection failed. Please try again.",
          });
          return;
        }

        // Prüfen, ob bereits ein Join-to-Create-Channel existiert
        let jTC = await JTC.findOne({
          guildId: interaction.guild.id,
        });

        if (jTC) {
          await interaction.followUp({
            content:
              "A Join-to-Create channel already exists. Use `/disable-jtc` to remove it first.",
          });
          return;
        }

        // Erstelle den Voice Channel
        const channel = await interaction.guild.channels.create({
          name: "Join to create",
          type: ChannelType.GuildVoice,
          parent: selectedCategories[0],
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              allow: [PermissionFlagsBits.Connect],
            },
          ],
        });

        // Speichere die Informationen in der Datenbank
        jTC = new JTC({
          guildId: interaction.guild.id,
          categoryId: selectedCategories[0],
          channelId: channel.id,
          roles: selectedRoles, // Speichere die Rollen-IDs
        });

        await jTC.save();
        for (let msg of msgToDelete) {
          await msg.delete();
        }

        const roleNames = await Promise.all(
          selectedRoles.map(async (roleId) => {
            const role = await interaction.guild.roles.fetch(roleId);
            return role ? role.name : null;
          })
        );

        // Final summary message
        await interaction.followUp({
          content: `The Join-to-Create channel has been created under the category: \`${
            (
              await interaction.guild.channels.fetch(selectedCategories)
            ).name
          }\`.\nSelected roles: \`${
            roleNames.length
              ? roleNames.filter((name) => name !== null).join(", ")
              : "None"
          }\`\nUse \`/disable-jtc\` to remove it.`,
        });
      });
    });
  },

  name: "setup-jtc",
  description: "Setup a join-to-create voice channel.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
