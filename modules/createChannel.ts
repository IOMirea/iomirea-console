import { Interface } from "readline";
import chalk from "chalk";

export default function(rl: Interface) {
    // Use arrow function in callback to keep context as client instance
    rl.question(chalk.green("Channel Name: "), name => {
        rl.question(chalk.green("Recipient IDs ") + chalk.yellow("(optional)") + chalk.green(" - seperate with comma: "), recipients => {

        });
    });
}