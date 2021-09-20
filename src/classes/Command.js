class Command {
    /**
     * @param {object} commandData Information and configuration about the command
     * @param {string} commandData.name The name used to call the command
     * @param {string[]} commandData.aliases The other names that can be used to call the command
     * @param {string} commandData.description A description of what the command do.
     * @param {string} commandData.category The command category belongs to.
     * @param {number} commandData.cooldown The time that the user has to wait before calling the command again
     * @param {import("discord.js").PermissionFlags[]} commandData.permissions
     * @param {boolean} commandData.devOnly
     */
    constructor(commandData) {
        this.help = {
            name: commandData.name,
            description: commandData.description,
            category: commandData.category,
        }

        this.config = {
            cooldownTime: commandData.cooldownTime || 500,
            aliases: commandData.aliases,
            permissions: commandData.permissions,
            devOnly: commandData.devOnly,
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

    /**
     * Checks if a member of a guild has permission to call this command.
     * @param {import("discord.js").GuildMember} member
     * @returns {boolean}
     */
    checkPermissions = (member) => {
        if (this.config.devOnly) {
            return member.user.id === process.env.DEV;
        }
        if (!member) return;
        if (!this.config.permissions || !this.config.permissions.length) {
            return true;
        }
        return member.permissions.has(this.config.permissions);
    }
}

module.exports = Command;