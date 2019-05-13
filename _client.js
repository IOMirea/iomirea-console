const fetch    = require("node-fetch");
const readline = require("readline");
const fs       = require("fs");
let config = {};
const Client = require("./structures/iomireaClient");
const client = new Client();
const chalk = require("chalk");
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
    });
})();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function showMenu() {
    console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|
                                      
                                      `);
    console.log(chalk.yellow("Connecting..."));
}

showMenu();