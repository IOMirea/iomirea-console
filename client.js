const fetch         = require("node-fetch");
const readline      = require("readline");
const fs            = require("fs");
const Client        = require("./structures/iomireaClient");
const chalk         = require("chalk");
const Channel       = require("./structures/Channel");
const User          = require("./structures/User");
const ConsoleHelper = require("./structures/ConsoleHelper");
let config          = {};
const client        = new Client();
const modules       = new Map(fs.readdirSync("./modules/").filter(v => v.endsWith(".js")).map(v => [v.split(".")[0], require(`./modules/${v}`).run]));

(() => {
    fs.readFile("./.config", "utf8", (err, data) => {
        if (err) {
            console.log(chalk.red("An error occured while trying to open .config"));
            process.exit(1);
        }
        for (const {key, value} of data.split("\n").map(v => {
            return {
                key: v.split("=")[0],
                value: v.substr(v.indexOf("=") + 1)
            }
        })) {
            config[key] = value;
        }

        client.login(config.ACCESS_TOKEN).catch(e => {
            e = JSON.parse(e);
            console.log(chalk.red("Error while logging in. " + e.message));
            process.exit(1);
        });
    });
})();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// rlState
// 0 = Menu Selection
// 1 = View Channels
// 2 = Account Information
// 3 = Channel Browser
// 4 = Channel Browser (Send Message)
let rlState = 0;

console.log("\033[2J" + chalk.yellow("\nConnecting..."));

/*function formatDate(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " " + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
}

function showAccount() {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log(`ID\t\t${client.user.id}`);
    console.log(`Username\t${client.user.name}`);
    console.log(`E-Mail:\t\t${client.user.email}`);
    console.log("(Press any key to go back)");
}

function showChannels() {
    const channels = Array.from(client.channels.values());
    console.log("#\tChannel Name\t\t\tUsers");
    console.log("―".repeat(process.stdout.columns < 48 ? process.stdout.columns : 48));
    for(let i=0;i<channels.length;++i) {
        console.log(`${i+1}\t${channels[i].name.substr(0, 24) + (channels[i].name.length > 24 ? "..." : ' '.repeat(24 - channels[i].name.length))}\t${channels[i].user_ids.length} Users`);
    }
    console.log("\n\nPress CTRL + C anytime to get back to the menu");
}

async function showChannel(channel, state = 0) {
    if (channel.constructor.name === "Number") channel = client.channels.get(channel);
    const messages = state === 0 ? await channel.fetchMessages(true) : channel.messages;
    for(let i=0;i<messages.length;++i) {
        const time = formatDate(Client.getTime(messages[i].id));
        console.log("[" + time + "] " + (" ".repeat(15 - time.length)) + "│ " + messages[i].author.name + (" ".repeat(10 - messages[i].author.name.length)) + "│ " + messages[i].content.substr(0, process.stdout.columns || 2048));
    }
    const spacePad = state === 2 ? 3 : 2;
    console.log(("\n").repeat(messages.length > process.stdout.rows ? 0 : process.stdout.rows - messages.length - spacePad) + (state === 2 ? "[CTRL+C] Back" : "[X] Send Message\t[C] Back to Channel Browser\t[R] Force Reload"));

    if (state === 2) {
        console.log("―".repeat(process.stdout.columns));
        process.stdout.write("> ");
        if (channel.inputText !== "") process.stdout.write(channel.inputText);
    }

}*/

client.on("ready", () => {
    console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
    console.log(ConsoleHelper.iomirea);
    modules.get("showMenu")();
});

process.stdin.on("keypress", (str, { name }) => {
    if (rlState === 0) {
        ConsoleHelper.reset();
        if (str === "1") {
            modules.get("showChannels")(client);
            rlState = 1;
        }
        else if (str === "2") {
            modules.get("showAccount")(client);
            rlState = 2;
        }
        else if (str === "3") process.exit(0);
        else modules.get("showMenu")();
    } else if (rlState === 1) {
        const answer = parseInt(str);
        console.clear();
        if (isNaN(answer)) {
            modules.get("showChannels")(client);
        }
        else {
            const channel = Array.from(client.channels.values())[answer - 1];
            if (channel === undefined) return console.log(chalk.red("An error occured!"));
            modules.get("showChannel")(channel, client);
            client.activeChannel = channel;
            channel.handleMessages(n => {
                if (channel.messages.length === n.length) return;
                else {
                    channel.messages = n;
                    console.clear();
                    modules.get("showChannel")(client.activeChannel, client, 1);
                }
            }, 1e3);
            rlState = 3;
        }
    } else if (rlState === 2) {
        ConsoleHelper.reset();
        modules.get("showMenu")();
        rlState = 0;
    } else if (rlState === 3) {
        if (str === "x") {
            console.clear();
            modules.get("showChannel")(client.activeChannel, client, 2);
            rlState = 4;
        } else if (str === "c") {
            ConsoleHelper.reset();
            rlState = 1;
            clearInterval(client.activeChannel.messageHandler);
            client.activeChannel = null;
            modules.get("showChannels")(client);
        } else if (str === "r") {
            client.activeChannel.fetchMessages(true).then(() => {
                console.clear();
                modules.get("showChannel")(client.activeChannel, client, 1);
            });
        }
    } else if (rlState === 4) {
        switch(name) {
            case "backspace":
                client.activeChannel.inputText = client.activeChannel.inputText.slice(0, -1);
                break;
            case "return":
                client.activeChannel.send().then(() => {
                    client.activeChannel.inputText = "";
                });
                break;
            default:
                client.activeChannel.inputText += str;
                break;
        }
    }
});

rl.on("SIGINT", () => {
    if (rlState === 4) {
        console.clear();
        modules.get("showChannel")(client.activeChannel, client, 1);
        rlState = 3;
        return;
    }
    client.removeActiveChannel();
    ConsoleHelper.reset();
    modules.get("showMenu")();
    rlState = 0;
});