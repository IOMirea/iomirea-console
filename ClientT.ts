import * as readline from 'readline';
import * as fs from 'fs';
import Client from './structures/Client';
import ConsoleHelper from './structures/ConsoleHelperT';
import chalk from "chalk";

// Helper module imports
import formatDate from './modules/formatDateT';
import showAccount from './modules/showAccountT';
import showChannel from './modules/showChannelT';
import showChannels from './modules/showChannelsT';
import showMenu from './modules/showMenuT';

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
let rlState: number = 0;

console.log(chalk.yellow("Connecting..."));

client.on("ready", () => {
    console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
    console.log(ConsoleHelper.iomirea);
    showMenu();
});

process.stdin.on("keypress", (str, { name }) => {

});