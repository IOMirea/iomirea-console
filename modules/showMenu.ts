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
    if (state === rlStates.MENU_SELECTION || state === rlStates.MENU_VIEW_CHANNEL) {
        const text = this.language.texts.MENU_VIEW_CHANNEL.t;
        console.log(chalk.inverse(" ".repeat(25 - text.length / 2) + text + " ".repeat(25 - text.length / 2)));
    } else
        console.log(this.language.texts.MENU_VIEW_CHANNEL.t);

    if (state === rlStates.MENU_ACCOUNT_INFO) {
        const text = this.language.texts.MENU_ACCOUNT_INFO.t;
        console.log(chalk.inverse(" ".repeat(25 - text.length / 2) + text + " ".repeat(25 - text.length / 2)));
    } else
        console.log(this.language.texts.MENU_ACCOUNT_INFO.t);

    if (state === rlStates.MENU_SETTINGS) {
        const text = this.language.texts.MENU_SETTINGS.t;
        console.log(chalk.inverse(" ".repeat(25 - text.length / 2) + text + " ".repeat(25 - text.length / 2)));
    } else
        console.log(this.language.texts.MENU_SETTINGS.t);

    if (state === rlStates.MENU_EXIT) {
        const text = this.language.texts.MENU_EXIT.t;
        console.log(chalk.inverse(" ".repeat(25 - text.length / 2) + text + " ".repeat(25 - text.length / 2)));
    } else
        console.log(this.language.texts.MENU_EXIT.t);
}