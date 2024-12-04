const { Client, Interaction } = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: (client, interaction) => {
    let randomNumber = Math.floor(Math.random() * 6) + 1;
    let dice;
    switch (randomNumber) {
      case 1:
        dice = "1️⃣";
        break;
      case 2:
        dice = "2️⃣";

        break;
      case 3:
        dice = "3️⃣";

        break;
      case 4:
        dice = "4️⃣";

        break;
      case 5:
        dice = "5️⃣";

        break;
      case 6:
        dice = "6️⃣";

        break;
    }
    try {
      return interaction.reply(dice);
    } catch (error) {
      console.log(
        `There was an error while throwing the dice. Error: ${error}`
      );
    }
  },
  name: "dice",
  description: "throws a dice",
};
