import chalk from 'chalk';
import { rlStates } from '../structures/Constants';

const texts: object = {
    VIEW_CHANNEL: "View Channel",
    ACCOUNT_INFO: "Account Information",
    SETTINGS:     "Settings",
    EXIT:         "Exit"
};

/**
 * Shows the main menu
 *
 * @param {number} state readline state
 * @returns {undefined}
 */
export default function(state: number) {
    if (state === rlStates.MENU_SELECTION || state === rlStates.MENU_VIEW_CHANNEL)
        console.log(chalk.inverse(" ".repeat(25 - texts["VIEW_CHANNEL"].length / 2) + texts["VIEW_CHANNEL"] + " ".repeat(25 - texts["VIEW_CHANNEL"].length / 2)));
    else
        console.log(texts["VIEW_CHANNEL"]);

    if (state === rlStates.MENU_ACCOUNT_INFO)
        console.log(chalk.inverse(" ".repeat(25 - texts["ACCOUNT_INFO"].length / 2) + texts["ACCOUNT_INFO"] + " ".repeat(25 - texts["ACCOUNT_INFO"].length / 2)));
    else
        console.log(texts["ACCOUNT_INFO"]);

    if (state === rlStates.MENU_SETTINGS)
        console.log(chalk.inverse(" ".repeat(25 - texts["SETTINGS"].length / 2) + texts["SETTINGS"] + " ".repeat(25 - texts["SETTINGS"].length / 2)));
    else
        console.log(texts["SETTINGS"]);

    if (state === rlStates.MENU_EXIT)
        console.log(chalk.inverse(" ".repeat(25 - texts["EXIT"].length / 2) + texts["EXIT"] + " ".repeat(25 - texts["EXIT"].length / 2)));
    else
        console.log(texts["EXIT"]);
}