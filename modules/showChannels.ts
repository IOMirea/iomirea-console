import Client from '../structures/Client';
import Channel from '../structures/Channel';
import chalk from 'chalk';

function print(text:string, state: number, cstate: number): string {
    return (state === cstate ? chalk.inverse(text) : text);
}

export default function(client: Client, state: number) {
    const channels: Array<Channel> = Array.from(client.channels.values());
    console.log("#\tChannel Name\t\t\tUsers\t\tID");
    console.log("―".repeat(process.stdout.columns));
    for(let i: number = 0;i < channels.length; ++i) {
        const name: string = channels[i].name.substr(0, 24) + (channels[i].name.length > 24 ? "..." : ' '.repeat(24 - channels[i].name.length));
        const users = channels[i].user_ids.length + " Users";
        console.log(print(`${i+1}${" ".repeat(8)}${name}${" ".repeat(35 - (name.endsWith("...") ? 27 : name.length))}${users}${" ".repeat(16 - users.length)}${channels[i].id}`, state, i + 1));
    }
    console.log("\n\nPress CTRL + C anytime to get back to the menu");
    console.log("(" + state + ")")
}