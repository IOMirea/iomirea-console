import chalk from 'chalk';

const texts: object = {
    VIEW_CHANNEL: "1)    View Channel",
    ACCOUNT_INFO: "2)    Account Information",
    SETTINGS:     "3)    Settings",
    EXIT:         "4)    Exit"
};

export default function(state: number) {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    if (state === 0 || state === 0.1) console.log(chalk.inverse(texts["VIEW_CHANNEL"] + " ".repeat(50 - texts["VIEW_CHANNEL"].length)));
    else console.log(texts["VIEW_CHANNEL"]);
    if (state === 0.2) console.log(chalk.inverse(texts["ACCOUNT_INFO"] + " ".repeat(50 - texts["ACCOUNT_INFO"].length)));
    else console.log(texts["ACCOUNT_INFO"]);
    if (state === 0.3) console.log(chalk.inverse(texts["SETTINGS"] + " ".repeat(50 - texts["SETTINGS"].length)));
    else console.log(texts["SETTINGS"]);
    if (state === 0.4) console.log(chalk.inverse(texts["EXIT"] + " ".repeat(50 - texts["EXIT"].length)));
    else console.log(texts["EXIT"]);

    console.log(state);
}