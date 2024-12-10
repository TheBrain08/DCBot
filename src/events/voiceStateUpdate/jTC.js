const { Client, ChannelType, PermissionsBitField } = require("discord.js");
const JTC = require("../../models/JTC");

const createdChannels = new Map();

/**
 * @param {Client} client
 * @param {*} oldState
 * @param {*} newState
 */
module.exports = async (client, oldState, newState) => {
  try {
    // Überprüfen, ob oldState und newState existieren und ob guild darin enthalten ist
    if (!oldState || !newState) {
      console.error("oldState or newState are not defined.");
      return;
    }
    const guild = newState.guild || oldState.guild;
    if (!guild) {
      console.error("no guild was found.");
      return;
    }

    const jTC = await JTC.findOne({ guildId: guild.id });

    if (!jTC) {
      console.error(`no jtc was found for this guild: ${guild.id}.`);
      return;
    }

    const channelId = jTC.channelId;
    const categoryId = jTC.categoryId;
    const roles = jTC.roles;

    if (newState.channelId === channelId) {
      const channel = guild.channels.cache.get(channelId);
      if (!channel) {
        console.error(`Channel with ID ${channelId} not found.`);
        return;
      }

      const userId = newState.id;
      const user = newState.member.user;
      const globalName = user.globalName || user.username;

      const targetChannel = await guild.channels.create({
        name: `${globalName}'s VC`,
        type: ChannelType.GuildVoice,
        parent: categoryId,
        permissionOverwrites: [
          {
            id: userId,
            allow: [
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.Speak,
              PermissionsBitField.Flags.Stream,
              PermissionsBitField.Flags.MuteMembers,
              PermissionsBitField.Flags.DeafenMembers,
              PermissionsBitField.Flags.MoveMembers,
              PermissionsBitField.Flags.ManageMessages,
              PermissionsBitField.Flags.ManageRoles,
              PermissionsBitField.Flags.ManageWebhooks,
              PermissionsBitField.Flags.ManageChannels,
            ],
          },
          {
            id: guild.roles.everyone.id,
            allow: [PermissionsBitField.Flags.Connect],
          },
          ...roles
            .map((role) => {
              const resolvedRole = guild.roles.cache.get(role.id || role);
              if (resolvedRole) {
                return {
                  id: resolvedRole.id,
                  allow: [
                    PermissionsBitField.Flags.Connect,
                    PermissionsBitField.Flags.Speak,
                    PermissionsBitField.Flags.Stream,
                    PermissionsBitField.Flags.MuteMembers,
                    PermissionsBitField.Flags.DeafenMembers,
                    PermissionsBitField.Flags.MoveMembers,
                    PermissionsBitField.Flags.ManageMessages,
                    PermissionsBitField.Flags.ManageRoles,
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.ManageWebhooks,
                  ],
                };
              }
              return null;
            })
            .filter(Boolean),
        ],
      });

      await newState.setChannel(targetChannel.id);
      createdChannels.set(targetChannel.id, targetChannel);

      // Überwachen, wenn der neue Channel leer ist und löschen
      client.on("voiceStateUpdate", async (oldState, newState) => {
        createdChannels.forEach(async (channel, channelId) => {
          if (
            oldState.channelId === channelId ||
            newState.channelId === channelId
          ) {
            const updatedChannel = await guild.channels.fetch(channelId);
            if (updatedChannel.members.size === 0) {
              await updatedChannel.delete();
              createdChannels.delete(channelId); // Channel aus der Map entfernen
            }
          }
        });
      });
    }
  } catch (error) {
    console.error("Error in the JTC process:", error);
  }
};
