const Discord = require("discord.js");
const rfr = require("rfr");
const { join } = require("path");
const fs = require("fs").promises;

class MusicClient extends Discord.Client {
  /**
   *
   * @param {object} options Options for the client instace
   * @param {Discord.ClientOptions} options.discord The options of discord.js client class
   * @param {string} options.defaultPrefix The fallback prefix for servers without custom ones
   * @param {string} options.commandsPath The path to the commands folder
   * @param {string} options.eventsPath The path to the events ffolder
   */
  constructor(options) {
    super(
      options.discord || {
        intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING],
      }
    );
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
    /**
     * Cache that holds the custom prefix for each guild
     * @type {Map<string, string>}
     */
    this.prefixCache = new Map();
  }

  /**
   * Tries to load commands files from a path.
   * @param {string} path The path that is going to be read, if not provided, it's going to be the default one.
   * @returns {Promise<void>}
   */
  loadCommands = async (path = this.commandsPath) => {
    if (!path) {
      throw new Error("I don't have a commands path");
    }
    try {
      const isPathAcessible = await fs
        .access(path)
        .then(() => true)
        .catch(() => false);
      if (!isPathAcessible) {
        throw new Error("Invalid commands path");
      }
      console.log(`[Commands] Loading commands file from ${path}...`);
      const pathFiles = await fs.readdir(path);
      if (!pathFiles.length) {
        console.warn("[Commands] None files have been found on commands path");
        return;
      }
      for (let i = 0; i < pathFiles.length; i++) {
        const file = pathFiles[i];
        const directory = join(path, file);
        console.log(
          `[Commands] (${i + 1} of ${
            pathFiles.length
          }) Loading ${file} from ${directory}...`
        );
        const fileStat = await fs.lstat(directory);
        if (fileStat.isDirectory()) {
          console.log(
            `[Commands] (${i + 1} of ${
              pathFiles.length
            }) ${file} is a directory, readding its content...`
          );
          this.loadCommands(directory);
          continue;
        }
        if (!file.endsWith(".js")) {
          console.log(
            `[Commands] (${i + 1} of ${
              pathFiles.length
            }) ${file} isn't a valid javascript file.`
          );
          continue;
        }
        const fileModule = rfr(directory);
        const commandData = new fileModule();
        if (!commandData.run || !commandData.help.name) {
          console.log(
            `[Commands] (${
              i + 1
            }) ${file} command is missing important information and can't be loaded.`
          );
          continue;
        }
        this.commands.set(commandData.help.name, commandData);
        if (commandData.config.aliases && commandData.config.aliases.length) {
          commandData.config.aliases.forEach((alias) => {
            this.aliases.set(alias, commandData.help.name);
          });
        }
        console.log(`[Commands] (${i + 1}) Loaded ${commandData.help.name}.`);
      }
    } catch (err) {
      console.error(
        "Something went wrong while reading command files:",
        err,
        err.stack
      );
      throw err;
    }
  };

  /**
   * Tries to loads listeners for the bot events
   * @returns {Promise<void>}
   */
  loadEvents = async () => {
    if (!this.eventsPath) {
      throw new Error("I don't have a events path");
    }
    try {
      const isPathAcessible = await fs
        .access(this.eventsPath)
        .then(() => true)
        .catch(() => false);
      if (!isPathAcessible) {
        throw new Error("Invalid commands path");
      }
      const files = await fs.readdir(this.eventsPath);
      if (!files.length) {
        console.warn("There is'nt any event file to read.");
        return;
      }
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const directory = join(this.eventsPath, file);
        console.log(
          `[Events] (${index + 1} of ${
            files.length
          }) Triying to load the event data from ${file}...`
        );
        const fileStat = await fs.lstat(directory);
        if (!file.endsWith(".js") || fileStat.isDirectory()) {
          console.log(
            `[Events] (${index + 1} of ${files.length}) ${file} isn't a valid js file.`
          );
          continue;
        }
        const fileModule = rfr(directory);
        const listener = new fileModule(this);
        if (!listener.run || !listener.name) {
          console.log(
            `[Events] (${index + 1} of ${
              files.length
            }) ${file} isn't a valid event file.`
          );
          continue;
        }
        console.log(listener.name)
        this.on(listener.name, listener.run);
      }
    } catch (err) {
      console.log(
        "Something went wrong while reading events files:",
        err,
        err.stack
      );
    }
  };

  /**
   * Loads commands, events and then log into discord.
   * @param {string} token 
   */
  login = async (token) => {
    if (!token) {
      throw new TypeError("The bot can not start without a token.");
    }
    try {
      console.log("[Login] Loading commands...");
      await this.loadCommands();
      console.log("[Login] Commands loaded.");
      console.log("[Login] Loading events...");
      await this.loadEvents();
      console.log("[Login] Events loaded.");
      console.log("[Login] Logging into discord...");
      await super.login(token);
    } catch (ex) {
        console.log("[Login] Something went wrong while starting the bot:", ex, ex.stack);
    }
  };
}

module.exports = MusicClient;
