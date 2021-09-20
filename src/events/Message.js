const { MessageEmbed } = require("discord.js");
const Listener = require("../classes/Listener");

class MessageListener extends Listener {
  constructor(client) {
    super({
      eventName: "messageCreate",
      /**
       * Function called when the event is emitted by the client.
       * @param {import("discord.js").Message} message The message sent
       */
      run: async (message) => {
        try {
          // to-do: implement a custom per guild prefix system.
          const guildPrefix = this.client.defaultPrefix;

          if (message.author.bot) return;
          if (message.channel.type !== "GUILD_TEXT") return;
          if (!message.content.startsWith(guildPrefix)) return;

          const args = message.content
            .slice(guildPrefix.length)
            .trim()
            .split(" ");
          const commandName = args.shift().toLowerCase();

          const isAlias = this.client.aliases.get(commandName);
          const command = this.client.commands.get(
            isAlias ? isAlias : commandName
          );
          if (!command) return;
          if (command.checkCooldown(message.author.id)) {
              return message.reply({
                  embeds: [
                      new MessageEmbed()
                        .setColor(0xffcc00)
                        .setDescription("**⚠️ You need to wait a moment before using that command again.**")
                        .setTimestamp()
                        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                  ]
              })
          }
          command.run({ message, client: this.client, args });
        } catch (ex) {
          console.log(
            `Something went wrong while running a listener (${this.name}) function:`,
            ex,
            ex.stack
          );
        }
      },
      client,
    });
  }
}

module.exports = MessageListener;
