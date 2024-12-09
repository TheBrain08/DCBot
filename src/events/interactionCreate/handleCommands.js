const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  try {
    // Wenn es sich um einen Slash Command handelt
    if (interaction.isChatInputCommand()) {
      const localCommands = getLocalCommands();

      const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName
      );

      if (!commandObject) return;

      // Prüfe auf Entwickler-Berechtigung
      if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only developers are allowed to run this command.",
          ephemeral: true,
        });
        return;
      }

      // Prüfe auf Test-Server-Berechtigung
      if (commandObject.testOnly && interaction.guild.id !== testServer) {
        interaction.reply({
          content: "This command cannot be ran here.",
          ephemeral: true,
        });
        return;
      }

      // Prüfe auf Berechtigungen des Mitglieds
      if (commandObject.permissionsRequired?.length) {
        for (const permission of commandObject.permissionsRequired) {
          if (!interaction.member.permissions.has(permission)) {
            interaction.reply({
              content: "Not enough permissions.",
              ephemeral: true,
            });
            return;
          }
        }
      }

      // Prüfe auf Berechtigungen des Bots
      if (commandObject.botPermissions?.length) {
        const bot = interaction.guild.members.me;
        for (const permission of commandObject.botPermissions) {
          if (!bot.permissions.has(permission)) {
            interaction.reply({
              content: "I don't have enough permissions.",
              ephemeral: true,
            });
            return;
          }
        }
      }

      await commandObject.callback(client, interaction);
    }
  } catch (error) {
    console.log(`There was an error handling the interaction: ${error}`);
  }
};
