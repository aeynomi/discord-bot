const Discord = require("discord.js");

class MusicClient extends Discord.Intents {
    /**
     * 
     * @param {object} options Options for the client instace
     * @param {Discord.ClientOptions} options.discord The options of discord.js client class
     * @param {string} options.defaultPrefix The fallback prefix for servers without custom ones
     * @param {string} options.commandsPath The path to the commands folder
     * @param {string} options.eventsPath The path to the events ffolder
     */
    constructor(options) {
        super({
            intents: [Discord.Intents.FLAGS.GUILDS]
        })
        /**
         * The prefix that the bot will use in case the server does'nt have a custom one.
         * @type {string}
         */
        this.defaultPrefix = options.defaultPrefix || process.env.DEFAULT_PREFIX;
        /**
         * The path to the command files folder
         * @type {string}
         */
        this.commandsPath = options.commandsPath;
        /**
         * The path to the event files folder
         * @type {string}
         */
        this.eventsPath = options.eventsPath;
        /**
         * The bot loaded commands
         * @type {Discord.Collection<string, any>}
         */
        this.commands = new Discord.Collection();
        /**
         * The aliases of the commands
         * @type {Discord.Collection<string, string>}
         */
        this.aliases = new Discord.Collection();
    }
}

module.exports = MusicClient;