const { Client, Interaction } = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: (client, interaction) => {
    let randomNumber = Math.floor(Math.random() * 2) + 1;
    let coin;
    switch (randomNumber) {
      case 1:
        coin = "😀";
        break;
      case 2:
        coin = ":coin:";

        break;
    }
    try {
      return interaction.reply(coin);
    } catch (error) {
      console.log(`There was an error while fliping the coin. Error: ${error}`);
    }
  },
  name: "coin",
  description: "flips a coin",
};
