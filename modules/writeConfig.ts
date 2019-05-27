import Config from '../structures/Config';
import * as fs from 'fs';
import chalk from 'chalk';

export default function(config: Config): Promise<Config> {
    const configElements: Array<Array<string>> = Object.entries(config);
    return new Promise((resolve, reject) => {
        fs.writeFile("./.config", configElements.map(v => v[0] + "=" + v[1]).join("\n"), (err) => {
            if (err) reject("An error occurred while trying to write to .config file!");
            else resolve(config);
        });
    });
}