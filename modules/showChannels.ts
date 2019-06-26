import Channel from '../structures/Channel';
import ConsoleSelector from '../structures/ConsoleSelector';

/**
 * Shows all channels the current user has access to
 *
 * @param {ConsoleSelector} cselector The ConsoleSelector instance
 * @returns {undefined}
 */
export default function(cselector: ConsoleSelector) {
    if (cselector.state === undefined) cselector.state = 1;
    const channels: Array<Channel> = Array.from(this.channels.values());
    console.log("#\t" + this.language.texts.CHANNEL_NAME + "\t\t\tUsers\t\tID");
    console.log("―".repeat(process.stdout.columns));
    for(let i: number = 0;i < channels.length; ++i) {
        const name: string = channels[i].name.substr(0, 24) + (channels[i].name.length > 24 ? "..." : ' '.repeat(24 - channels[i].name.length));
        const users = channels[i].user_ids.length + " Users";
        cselector.log(`${i+1}${" ".repeat(8)}${name}${" ".repeat(35 - (name.endsWith("...") ? 27 : name.length))}${users}${" ".repeat(16 - users.length)}${channels[i].id}`, i);
    }

    console.log("\n\n" + this.language.texts.CHANNEL_BACK + " | " + this.language.texts.CHANNEL_CREATE);
}