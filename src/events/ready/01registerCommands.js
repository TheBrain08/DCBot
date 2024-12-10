const { testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const existingCommands = await getApplicationCommands(client, testServer);

    const registeredCommands = [];
    const newCommands = [];
    const updatedCommands = [];

    // Iteriere über alle lokalen Befehle
    for (const localCommand of localCommands) {
      const existingCommand = existingCommands.cache.find(
        (cmd) => cmd.name === localCommand.name
      );

      if (existingCommand) {
        // Vergleiche, ob der bestehende Befehl verändert wurde
        if (areCommandsDifferent(existingCommand, localCommand)) {
          // Wenn der Befehl geändert wurde
          updatedCommands.push(localCommand.name);
          // Aktualisiere den Befehl
          await existingCommand.edit({
            description: localCommand.description,
            options: localCommand.options,
          });
        } else {
          // Wenn der Befehl nicht verändert wurde
          registeredCommands.push(localCommand.name);
        }
      } else {
        // Wenn der Befehl noch nicht existiert
        newCommands.push(localCommand.name);
        // Erstelle den neuen Befehl
        await existingCommands.create({
          name: localCommand.name,
          description: localCommand.description,
          options: localCommand.options,
        });
      }
    }

    // Finde alte Befehle, die nicht mehr lokal existieren
    const localCommandNames = localCommands.map((cmd) => cmd.name);
    const commandsToDelete = existingCommands.cache.filter(
      (cmd) => !localCommandNames.includes(cmd.name)
    );

    for (const command of commandsToDelete.values()) {
      await command.delete();
      console.log(`🗑️ Deleted old command: ${command.name}`);
    }

    // Logge die Ergebnisse
    if (newCommands.length > 0) {
      console.log(
        `👍 Registered the following new commands: ${newCommands.join(", ")}`
      );
    }
    if (updatedCommands.length > 0) {
      console.log(
        `🔁 Updated the following commands: ${updatedCommands.join(", ")}`
      );
    }
    if (registeredCommands.length > 0) {
      console.log(
        `✔ Registered the following commands: ${registeredCommands.join(", ")}`
      );
    }

    console.log("✅ All commands have been registered/updated!");
  } catch (error) {
    console.log(`❌ There was an error: ${error}`);
  }
};
