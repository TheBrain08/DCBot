const countingChannelId = "1315092584061861888";

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.id !== countingChannelId) return;

  try {
    if (message.content === "start") {
      await message.channel.send("0");
      message.delete();
    } else {
      const lastMessage = await message.channel.messages.fetch({ limit: 2 });
      const lastMessageContent = lastMessage.last().content;

      // Prüfen, ob die letzte Nachricht eine Zahl war
      const lastNumber = parseInt(lastMessageContent);

      const currentMessageContent = message.content;
      const currentNumber = parseInt(currentMessageContent);
      let replyMessage;

      if (isNaN(currentNumber)) {
        replyMessage = await message.reply({
          content: "Please enter a valid number.",
        });
        await message.delete(); // Lösche die ungültige Nachricht
        setTimeout(async () => {
          await replyMessage.delete();
        }, 3000);

        return;
      }

      // Überprüfen, ob der Benutzer die letzte Nachricht gesendet hat
      if (message.author.id !== lastMessage.last().author.id) {
        if (currentNumber === lastNumber + 1) {
          await message.react("✅"); // Richtiges Zählen, Emoji hinzufügen
        } else {
          await message.react("❎"); // Falsche Zahl, Emoji hinzufügen
          await message.reply(
            "That's wrong! Please start again with number 1."
          );

          // Dies ist optional, wenn du den Zähler auf 0 zurücksetzen möchtest
          await message.channel.send("0");
        }
      } else {
        replyMessage = await message.reply({
          content:
            "You cannot send the next number to yourself. Please wait for someone else to respond.",
        });
        message.delete();
        setTimeout(async () => {
          await replyMessage.delete();
        }, 3000);
      }
    }
  } catch (error) {
    console.error(`Error in counting process: ${error}`);
  }
};
