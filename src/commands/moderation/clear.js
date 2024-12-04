const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const amount = interaction.options.getInteger("amount");
    console.log(amount);

    if (amount < 1 || amount > 100) {
      return interaction.reply("Please enter a number between 1 and 100.");
    }

    try {
      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });
      await interaction.channel.bulkDelete(messages);
      return interaction.reply(`${amount} messages has been deleted.`);
    } catch (error) {
      console.log(
        `There was an error while trying to clear messages. Error: ${error}`
      );
    }
  },
  name: "clear",
  description: "delets amount of messages",
  options: [
    {
      name: "amount",
      description:
        "amount of messages you want to delete (max 100) (not older than 14 days)",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
};
