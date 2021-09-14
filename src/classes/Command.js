class Command {
    /**
     * @param {object} commandData Information and configuration about the command
     * @param {string} commandData.name The name used to call the command
     * @param {string[]} commandData.aliases The other names that can be used to call the command
     * @param {string} commandData.description A description of what the command do.
     * @param {string} commandData.category The command category belongs to.
     * @param {number} commandData.cooldown The time that the user has to wait before calling the command again
     */
    constructor(commandData) {
        this.help = {
            name: commandData.name,
            description: commandData.description,
            category: commandData.category,
        }

        this.config = {
            cooldownTime: commandData.cooldownTime || 500,
            aliases: commandData.aliases
        }

        this.cooldown = new Set();
    }

    /**
     * Checks if a user can call the command
     * @param {string} userId 
     * @returns {boolean}
     */
    checkCooldown = (userId) => {
        if (this.cooldown.has(userId)) {
            return true;
        }
        this.cooldown.add(userId);
        setTimeout(() => {
            this.cooldown.delete(userId);
        }, this.config.cooldownTime);
    }
}

module.exports = Command;