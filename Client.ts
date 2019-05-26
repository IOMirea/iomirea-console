import * as readline from 'readline';
import * as fs from 'fs';
import Client from './structures/Client';
import ConsoleHelper from './structures/ConsoleHelperT';
import chalk from "chalk";

// Helper module imports
import formatDate from './modules/formatDate';
import showAccount from './modules/showAccount';
import showChannel from './modules/showChannel';
import showChannels from './modules/showChannels';
import showMenu from './modules/showMenu';
import showSettings from './modules/showSettings';
import Channel from "./structures/Channel";

const config: object = {};
const client: Client = new Client();

fs.readFile("./.config", "utf8", (err, data) => {
    if (err) {
        console.log(chalk.red("An error occured while trying to open .config"));
        process.exit(1);
    }
    for (const { key, value } of data.split("\n").map(v => ({ key: v.split("=")[0], value: v.substr(v.indexOf("=") + 1) }))) {
        Object.defineProperty(config, key, {
            value,
            writable: false
        });
    }

    client.login(config["ACCESS_TOKEN"]).catch(e => {
        const parsed: object = JSON.parse(e);
        console.log(chalk.red("Error while logging in. " + e.message));
        process.exit(1);
    });
});

const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// rlState
// 0 = Menu Selection
// 1 = View Channels
// 2 = Account Information
// 3 = Channel Browser
// 4 = Channel Browser (Send Message)
// 5 = Settings
let rlState: number = 0;

console.log(chalk.yellow("Connecting..."));

client.on("ready", () => {
    console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
    console.log(ConsoleHelper.iomirea);
    showMenu();
});

process.stdin.on("keypress", async (str, {name}) => {
    if (rlState === 0) {
        if (str !== "3") ConsoleHelper.reset();
        if (str === "1") {
            showChannels(client);
            rlState = 1;
        }
        else if (str === "2") {
            showAccount(client);
            rlState = 2;
        }
        else if (str === "3") {
            showSettings(config);
            rlState = 5;
        }
        else if (str === "4") process.exit(0);
        else showMenu();
    } else if (rlState === 1) {
        const answer = parseInt(str);
        console.clear();
        if (isNaN(answer)) {
            showChannels(client);
        }
        else {
            const channel: Channel = Array.from(client.channels.values())[answer - 1];
            if (channel === undefined) return console.log(chalk.red("An error occured!"));
            await showChannel(channel, client);
            client.activeChannel = channel;
            channel.handleMessages(n => {
                if (channel.messages.length === n.length) return;
                else {
                    channel.messages = n;
                    if (rlState === 3) {
                        console.clear();
                        showChannel(client.activeChannel, client, 1);
                    }
                }
            }, 1e3);
            rlState = 3;
        }
    } else if (rlState === 2) {
        ConsoleHelper.reset();
        showMenu();
        rlState = 0;
    } else if (rlState === 3) {
        if (str === "x") {
            console.clear();
            showChannel(client.activeChannel, client, 2);
            rlState = 4;
        } else if (str === "c") {
            ConsoleHelper.reset();
            rlState = 1;
            clearInterval(client.activeChannel.messageHandler);
            client.activeChannel = null;
            showChannels(client);
        } else if (str === "r") {
            client.activeChannel.fetchMessages(true).then(() => {
                console.clear();
                showChannel(client.activeChannel, client, 1);
            });
        }
    } else if (rlState === 4) {
        switch (name) {
            case "backspace":
                client.activeChannel.inputText = client.activeChannel.inputText.slice(0, -1);
                break;
            case "return":
                client.activeChannel.send().then(() => {
                    client.activeChannel.inputText = "";
                    console.clear();
                    showChannel(client.activeChannel, client, 1);
                    rlState = 3;
                });
                break;
            default:
                client.activeChannel.inputText += str;
                break;
        }
    } else if (rlState === 5) { //TODO
        if (str === "1") {
            // Change Access Token
        } else if (str === "2") {
            // Change Language
        } else if (str === "3") {
            // Change Color Scheme
        } else if (str === "4") {
            ConsoleHelper.reset();
            showMenu();
            rlState = 0;
        }
    }
});

rl.on("SIGINT", () => {
    if (rlState === 4) {
        console.clear();
        showChannel(client.activeChannel, client, 1);
        rlState = 3;
        return;
    }
    client.removeActiveChannel();
    ConsoleHelper.reset();
    showMenu();
    rlState = 0;
});