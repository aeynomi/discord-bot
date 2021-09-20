class Listener {
    /**
     * 
     * @param {object} listenerData Information about the event
     * @param {string} listenerData.eventName The event name
     * @param {function} listenerData.run The event function
     * @param {import("./Client")} listenerData.client The event client emitter
     */
    constructor(listenerData) {
        /**
         * The event that this class listens to
         * @type {string}
         */
        this.name = listenerData.eventName;
        /**
         * The function called when the event is emitted
         * @type {function}
         */
        this.run = listenerData.run;
        /**
         * The client that emits the event
         * @type {import("./Client")}
         */
        this.client = listenerData.client;
    }
}

module.exports = Listener;