import ConsoleSelector from '../structures/ConsoleSelector';
import { SettingsEntries } from "../structures/Constants";

export default function(config: object, cselector: ConsoleSelector) {
    if (cselector.state === undefined) cselector.state = 1;

    for (let i: number = 0; i < SettingsEntries.length; ++i) {
        // TODO: use i + 1 instead of just i
        // cselector.log(i + ")" + " ".repeat(8) + SettingsEntries[i], i);
    }
}