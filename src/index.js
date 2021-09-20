const Client = require("./classes/Client");
const client = new Client({
    defaultPrefix: "a!",
    commandsPath: "./src/commands",
    eventsPath: "./src/events"
});

client.login(process.env.TOKEN);