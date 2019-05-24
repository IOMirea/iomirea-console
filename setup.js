// Setup
const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/* Promisify functions with callback */
const { promisify } = require("util");
const readFile      = promisify(fs.readFile);
const writeFile    = promisify(fs.writeFile);

let config, newFile = false, token;

async function loadFile() {
    try {
        config = await readFile("./.config", "utf8");
    } catch(e) {
        console.log(chalk.yellow(".config not found! Creating file..."));
        await writeFile("./.config", "");
        newFile = true;
    }
}

async function start () {
    await loadFile();
    console.log(chalk.green("Loaded .config file!"));

    rl.question("Access Token: ", r => {
        if (r.length === 0) {
            console.log("Pleaes provide an Access Token.");
            start();
        } else {
            writeFile("./config", r);
        }
    });
}
start();