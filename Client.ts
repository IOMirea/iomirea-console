// Structure and package imports
import * as readline from 'readline';
import * as fs from 'fs';
import chalk from "chalk";
import { writeFile } from 'fs';
import Client from './structures/Client';
import ConsoleHelper from './structures/ConsoleHelperT';
import Config from './structures/Config';
import Channel from './structures/Channel';
import ConsoleSelector from './structures/ConsoleSelector'

// Helper module imports
import formatDate from './modules/formatDate';
import showAccount from './modules/showAccount';
import showChannel from './modules/showChannel';
import showChannels from './modules/showChannels';
import showMenu from './modules/showMenu';
import showSettings from './modules/showSettings';
import writeConfig from './modules/writeConfig';

const config: Config = {};
const client: Client = new Client();

// readline states
// Floating Point Error might occur if dynamic state
// -1 = Access Token Input
// 0 = Menu Selection
// 0.1 = Menu - View Channel
// 0.2 = Menu - Account Information
// 0.3 = Menu - Settings
// 0.4 = Menu - Exit
// 1 = View Channels
// 1.Z = View Channels (Index Z)
// 2 = Account Information
// 3 = Channel Browser
// 4 = Channel Browser (Send Message)
// 5 = Settings
// 6 = Settings (Change Access Token)
// 7 = Settings (Languages)
let rlState: number = 0;
let tempInput: string = "";
let selector: ConsoleSelector = new ConsoleSelector({ });
const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.readFile("./.config", "utf8", (err, data) => {
    if (err) {
        console.log(chalk.red("An error occurred while trying to open .config"));
        process.exit(1);
    }
    let conf: Array<{ key: string, value: string }> = data.split("\n").map(v => ({ key: v.split("=")[0], value: v.substr(v.indexOf("=") + 1) }));
    if (conf.some(v => v.value.endsWith("\r"))) conf = conf.map(v => ({ key: v.key, value: v.value.slice(0, -1) }));
    for (const { key, value } of conf) {
        config[key] = value;
    }

    if (!config.hasOwnProperty("ACCESS_TOKEN")) { // No access token provided
        rl.question("Access Token: ", r => {
            config.ACCESS_TOKEN = r;
            writeConfig(config).catch(err => {
                console.log(chalk.red(err));
            });
        });
    }

    client.login(config["ACCESS_TOKEN"]).catch(e => {
        const parsed: object = JSON.parse(e);
        console.log(chalk.red("Error while logging in. " + (e.message || "Perhaps an invalid access token was provided?")));
        process.exit(1);
    });
});

console.clear();
console.log(chalk.yellow("Connecting..."));

client.on("ready", () => {
    console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
    console.log(ConsoleHelper.iomirea);
    showMenu(rlState = 0.1);
});

process.stdin.on("keypress", async (str, {name}) => {
    if (rlState >= 0 && rlState < 1) {
        if (name === "down" || str === "s") {
            ConsoleHelper.reset();
            if (rlState === 0 || rlState === 0.1) showMenu(rlState = 0.2);
            else if (rlState === 0.2) showMenu(rlState = 0.3);
            else if (rlState === 0.3) showMenu(rlState = 0.4);
            else showMenu(rlState = 0.4);
        } else if (name === "up" || str === "w") {
            ConsoleHelper.reset();
            if (rlState === 0.2) showMenu(rlState = 0.1);
            else if (rlState === 0.3) showMenu(rlState = 0.2);
            else if (rlState === 0.4) showMenu(rlState = 0.3);
            else showMenu(rlState = 0.1);
        } else if (name === "return") {
            if (rlState !== 0.4 && rlState !== 0.1) ConsoleHelper.reset({
                border: true
            });
            else if (rlState === 0.1) ConsoleHelper.reset();
            if (rlState === 0 || rlState === 0.1) {
                showChannels(client, selector);
                selector = new ConsoleSelector({
                    state: 1,
                    limit: client.channels.size
                });
                rlState = 1.0;
            }
            else if (rlState === 0.2) {
                rlState = 2;
                showAccount(client);
            }
            else if (rlState === 0.3) {
                rlState = 5;
                showSettings(config);
            }
            else if (rlState === 0.4) process.exit(0);
        }
    } else if (rlState >= 1 && rlState < 2) {
        if (name === "down" || str === "s") {
            if (selector.state >= client.channels.size) return;
            ConsoleHelper.reset();
            selector.state++;
            showChannels(client, selector);
        } else if (name === "up" || str === "w") {
            if (selector.state <= 1) return;
            ConsoleHelper.reset();
            selector.state--;
            showChannels(client, selector);
        } else if (name === "return") {
            const channel: Channel = client.activeChannel = Array.from(client.channels.values())[selector.state - 1];
            channel.handleMessages(msgs => {
                if (channel.messages.length !== msgs.length) {
                    channel.messages = msgs;
                    showChannel(channel, client, 0);
                }
            }, 2000);
            rlState = 3;
            showChannel(channel, client, 0);
        }
    } else if (rlState === 2) {
        ConsoleHelper.reset({
            border: true
        });
        showMenu(rlState = 0.1);
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
            showChannels(client, selector);
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
            process.stdout.write("\n" + chalk.yellow("New Access Token: "));
            rlState = 6;
        } else if (str === "2") {
            // Change Language
            ConsoleHelper.reset({
                border: true
            });
            console.log("Only English is supported for now.");
            console.log("Press CTRL + C to go back")
        } else if (str === "3") {
            // Change Color Scheme
        } else if (str === "4") {
            ConsoleHelper.reset();
            showMenu(rlState = 0.1);
            rlState = 0;
        }
    } else if (rlState === 6) {
        if (name === "return") {
            client.accessToken = tempInput;
            config.ACCESS_TOKEN = tempInput;
            writeConfig(config).then(() => {
                ConsoleHelper.reset();
                showSettings(config);
                console.log(chalk.green("Successfully updated Access Token!"));
            }).catch(err => {
                console.log(chalk.red(err));
            });
            tempInput = "";
            rlState = 5;
            return;
        } else if (name === "backspace") tempInput = tempInput.slice(0, -1);
        tempInput += str;
    }
});

rl.on("SIGINT", () => {
    if (rlState >= 0 && rlState < 1) process.exit(0);
    if (rlState === 4) {
        console.clear();
        showChannel(client.activeChannel, client, 1);
        rlState = 3;
        return;
    }
    client.removeActiveChannel();
    ConsoleHelper.reset();
    showMenu(rlState = 0.1);
    rlState = 0;
    tempInput = "";
});