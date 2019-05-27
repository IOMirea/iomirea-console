import chalk from 'chalk';

const texts: object = {
    VIEW_CHANNEL: "View Channel",
    ACCOUNT_INFO: "Account Information",
    SETTINGS:     "Settings",
    EXIT:         "Exit"
};

export default function(state: number) {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    if (state === 0 || state === 0.1) console.log(chalk.inverse(" ".repeat(25 - texts["VIEW_CHANNEL"].length / 2) + texts["VIEW_CHANNEL"] + " ".repeat(25 - texts["VIEW_CHANNEL"].length / 2)));
    else console.log(texts["VIEW_CHANNEL"]);
    if (state === 0.2) console.log(chalk.inverse(" ".repeat(25 - texts["ACCOUNT_INFO"].length / 2) + texts["ACCOUNT_INFO"] + " ".repeat(25 - texts["ACCOUNT_INFO"].length / 2)));
    else console.log(texts["ACCOUNT_INFO"]);
    if (state === 0.3) console.log(chalk.inverse(" ".repeat(25 - texts["SETTINGS"].length / 2) + texts["SETTINGS"] + " ".repeat(25 - texts["SETTINGS"].length / 2)));
    else console.log(texts["SETTINGS"]);
    if (state === 0.4) console.log(chalk.inverse(" ".repeat(25 - texts["EXIT"].length / 2) + texts["EXIT"] + " ".repeat(25 - texts["EXIT"].length / 2)));
    else console.log(texts["EXIT"]);
}