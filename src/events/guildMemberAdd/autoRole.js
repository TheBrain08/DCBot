const { Client, GuildMember } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

/**
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    const guild = member.guild;
    if (!guild) return;

    const autoRole = await AutoRole.findOne({ guildId: guild.id });

    if (!autoRole) {
      console.log(`No auto roles configured for this guild.`);
      return;
    }

    const roleOneId = autoRole.roleOneId;
    const roleTwoId = autoRole.roleTwoId;

    const roleOne = member.guild.roles.cache.get(roleOneId);
    const roleTwo = roleTwoId ? member.guild.roles.cache.get(roleTwoId) : null;

    if (roleOne) {
      await member.roles.add(roleOne);
    } else {
      console.log(`Role with ID ${roleOneId} not found.`);
    }

    if (roleTwo) {
      await member.roles.add(roleTwo);
    } else if (roleTwoId) {
      console.log(`Role with ID ${roleTwoId} not found.`);
    }
  } catch (error) {
    console.log(`Error while adding auto roles: ${error}`);
  }
};
