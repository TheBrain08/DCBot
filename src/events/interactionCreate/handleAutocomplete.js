const { InteractionType } = require("discord.js");

module.exports = async (client, interaction) => {
  try {
    if (!interaction.isAutocomplete()) {
      return;
    }
  } catch (error) {
    console.log(
      `Es gab einen Fehler bei der Handhabung der Interaktion: ${error}`
    );
  }
};
