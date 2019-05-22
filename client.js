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
// 3 = Channel Browser
let rlState = 0;

console.log("\033[2J" + chalk.yellow("\nConnecting..."));

function formatDate(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " " + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
}

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
    const channels = Array.from(client.channels.values());
    console.log("#\tChannel Name\t\t\tUsers");
    console.log("―".repeat(process.stdout.columns < 48 ? process.stdout.columns : 48));
    for(let i=0;i<channels.length;++i) {
        console.log(`${i+1}\t${channels[i].name.substr(0, 24) + (channels[i].name.length > 24 ? "..." : ' '.repeat(24 - channels[i].name.length))}\t${channels[i].user_ids.length} Users`);
    }
    console.log("\n\nPress CTRL + C anytime to get back to the menu");
}

async function showChannel(channel) {
    if (channel.constructor.name === "Number") channel = client.channels.get(channel);
    const messages = await channel.fetchMessages(false);
    //console.log("Time\t\t|\tMessage");
    //console.log("―".repeat(process.stdout.columns));
    for(let i=0;i<messages.length;++i) {
        const time = formatDate(Client.getTime(messages[i].id));
        console.log("[" + time + "]" + (" ".repeat(20 - time.length)) + messages[i].author.name + ">" + (" ".repeat(10 - messages[i].author.name.length))+ messages[i].content.substr(1, process.stdout.columns || 2048));
    }
    console.log(("\n").repeat(process.stdout.rows - messages.length - 2) + "[X] Send Message\t[C] Back to Channel Browser\t[]");
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
        console.clear();
        console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`);
        if (str === "1") {
            showChannels();
            rlState = 1;
        }
        else if (str === "2") {
            showAccount();
            rlState = 2;
        }
        else if (str === "3") process.exit(0);
        else showMenu();
    } else if (rlState === 1) {
        const answer = parseInt(str);
        console.clear();
        if (isNaN(answer)) return console.log(chalk.red("\t\t"+str));
        else showChannel(Array.from(client.channels.values())[answer - 1]);

    } else if (rlState === 2) {
        console.clear();
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

rl.on("SIGINT", () => {
    console.clear();
    console.log(`  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`);
    showMenu();
    rlState = 0;
});