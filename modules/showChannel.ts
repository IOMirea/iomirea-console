import formatDate from './formatDate';
import Channel from '../structures/Channel';
import Client from '../structures/Client';
import Message from '../structures/Message'
import chalk from "chalk";

const texts: any = {
    label: {
        bot: "[Bot]",
        user: "[User]"
    },
    controls: {
        back: "[CTRL+C] Back",
        send: "[X] Send Message",
        channel_browser: "[C] Back to Channel Browser",
        reload: "[R] Force Reload",
    }
};

export default async function (channel: Channel | string, client: Client, state: number = 0) {
    if (typeof channel === "string") channel = client.channels.get(channel);
    const messages: Array<Message> = state === 0 ? await channel.fetchMessages(true) : channel.messages;
    for (let i: number = 0; i < messages.length; ++i) {
        const time: string = formatDate(Client.getTime(messages[i].id));
        console.log("[" + time + "] " + (" ".repeat(15 - time.length)) + "│ " + messages[i].author.name + " " + (chalk.cyan(messages[i].author.bot ? texts.label.bot : texts.label.user)) + (" ".repeat(10 - messages[i].author.name.length)) + "│ " + messages[i].content.substr(0, process.stdout.columns || 2048));
    }
    let spacePad: number = state === 2 ? 3 : 2;
    console.log(("\n").repeat(messages.length > process.stdout.rows - spacePad ? 0 : process.stdout.rows - messages.length - spacePad) + (state === 2 ? texts.controls.back : `${texts.controls.send}\t${texts.controls.channel_browser}\t${texts.controls.reload}`));

    if (state === 2) {
        console.log("―".repeat(process.stdout.columns));
        process.stdout.write("> ");
        if (channel.inputText !== "") process.stdout.write(channel.inputText);
    }
}