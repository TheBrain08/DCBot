const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (interaction) => {
  try {
    if (interaction.customId === "0") {
      // Beispiel für den "previous"-Button
      await interaction.update({
        content: "You clicked the previous button!",
      });
      //await handleButtonInteractions(interaction); // Verarbeite die Button-Interaktion
    } else if (interaction.customId === "1") {
      // Beispiel für den "next"-Button
      await interaction.update({
        content: "You clicked the next button!",
      });
    } else if (interaction.customId === "2") {
      // Beispiel für den "next"-Button
      await interaction.update({
        content: "Admin button pressed!",
      });
    }
  } catch (error) {
    console.error(`Error in handleButtonInteractions: ${error}`);
  }
};
