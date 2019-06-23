import ConsoleSelector from '../structures/ConsoleSelector';
import { SettingsEntries } from "../structures/Constants";

export default function(config: object, cselector: ConsoleSelector) {
    if (cselector.state === undefined) cselector.state = 1;

    for (let i: number = 0; i < SettingsEntries.length; ++i) {
        cselector.log((i + 1) + ")" + " ".repeat(8) + SettingsEntries[i], i);
    }
}