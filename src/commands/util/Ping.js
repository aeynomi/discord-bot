const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");

class Ping extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Checks the bot response time",
      aliases: ["p"],
      category: "util",
    });
  }
  /**
   * @param {object} commandData Information about how the command was called.
   * @param {import("../../classes/Client")} commandData.client
   * @param {string[]} commandData.args
   * @param {import("discord.js").Message} commandData.message
   */
  run = async ({ client, message }) => {
    try {
      const now = Date.now();
      const messageSent = await message.channel.send("🏓⌛...");
      await messageSent.edit({
        content: "**Results:**",
        embeds: [
          new MessageEmbed()
          .setColor(0x7C83FD)
          .setDescription(`🤖 It took around \`${messageSent.createdTimestamp - now}\`ms for me to send a message\n📤 The websocket ping is around \`${client.ws.ping}\`ms`)
        ]
      })
    } catch (err) {
      console.log(
        `Something went wrong while running ${this.help.name} command:`,
        err,
        err.stack
      );
    }
  };
}

module.exports = Ping;
