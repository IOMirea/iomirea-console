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

console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`, chalk.yellow("\nConnecting..."));


client.on("ready", () => {
    console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
});