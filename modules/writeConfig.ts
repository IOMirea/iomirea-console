import Config from '../structures/Config';
import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Writes the new config
 *
 * @param {Config} config The config object
 * @returns {Promise<Config>}
 */
export default function(config: Config): Promise<Config> {
    const configElements: Array<Array<string>> = Object.entries(config);
    return new Promise((resolve, reject) => {
        fs.writeFile("./.config", configElements.map(v => v[0] + "=" + v[1]).join("\n"), (err) => {
            if (err) reject(this.language.texts.FS_WRITE_ERROR.t);
            else resolve(config);
        });
    });
}