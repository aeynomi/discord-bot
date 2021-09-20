const Listener = require("../classes/Listener");

class ReadyListener extends Listener {
    constructor(client) {
        super({
            eventName: "ready",
            run: () => {
                console.log(`⚡ Online at ${this.client.user.tag}`);
            },
            client,
        })
    }
}

module.exports = ReadyListener;