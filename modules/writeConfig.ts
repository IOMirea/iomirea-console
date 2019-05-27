import Config from '../structures/Config';
import * as fs from 'fs';
import chalk from 'chalk';

export default function(config: Config) {
    const configElements: Array<Array<string>> = Object.entries(config);
    fs.writeFile("./.config", configElements.map(v => v[0] + "=" + v[1]).join("\n"), (err) => {
        console.log(chalk.red("An error occurred while trying to write to .config file!"));
    });
}