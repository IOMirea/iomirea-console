const fetch    = require("node-fetch");
const readline = require("readline");
const fs       = require("fs");
const Client   = require("./structures/iomireaClient");
const chalk    = require("chalk");
const Channel  = require("./structures/Channel");
const User     = require("./structures/User");
let config = {};

const client = new Client();

(() => {
    fs.readFile("./.config", "utf8", (err, data) => {
        for (const {key, value} of data.split("\n").map(v => {
            return {
                key: v.split("=")[0],
                value: v.substr(v.indexOf("=") + 1)
            }
        })) {
            config[key] = value;
        }

        client.login(config.ACCESS_TOKEN).catch(e => {
            console.log(chalk.red("Error while logging in: " + e));
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
let rlState = 0;

console.log("\033[2J" + chalk.yellow("\nConnecting..."));

function showMenu() {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log("1)\tView Channel");
    console.log("2)\tAccount Information");
    console.log("3)\tExit");
}

function showAccount() {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log(`ID\t\t${client.user.id}`);
    console.log(`Username\t${client.user.name}`);
    console.log(`E-Mail:\t\t${client.user.email}`);
    console.log("(Press any key to go back)");
}

function showChannels() {

}

client.on("ready", () => {
    console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
    console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`);
    showMenu();
});

process.stdin.on("keypress", str => {
    if (rlState === 0) {
        console.log("\033[2J");
        console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`);
        if (str === "1") {
            rlState = 1;
        }
        else if (str === "2") {
            showAccount();
            rlState = 2;
        }
        else if (str === "3") process.exit(0);
        else showMenu();
    } else if (rlState === 1) {

    } else if (rlState === 2) {
        console.log("\033[2J");
        console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`);
        showMenu();
        rlState = 0;
    }
});