import formatDate from './formatDate';
import formatTime from './formatTime';
import Channel from '../structures/Channel';
import Client from '../structures/Client';
import Message from '../structures/Message'
import chalk from "chalk";

const texts: any = {
    label: {
        bot: "[Bot]",
        user: "[User]"
    },
};

/**
 * Shows messages in a channel / hud
 *
 * @param {Channel|string} channel The channel object
 * @param {Client} client The client instance
 * @param {number} state readline state
 * @returns {Promise<undefined>}
 */
export default async function (channel: Channel | string, client: Client, state: number = 0) {
    if (typeof channel === "string") channel = client.channels.get(channel);
    const messages: Array<Message> = state === 0 ? await channel.fetchMessages(true) : channel.messages;
    let date: string;
    for (let i: number = 0; i < messages.length; ++i) {
        if (i === 0) date = formatDate.call(client, Client.getTime(messages[i].id));
        const time: string = formatDate.call(client, Client.getTime(messages[i].id));
        if (date !== time) console.log(' '.repeat(process.stdout.columns / 2 - time.length) + chalk.inverse(date = time));
        console.log(chalk.magenta(formatTime(Client.getTime(messages[i].id))) + " ".repeat(3) + messages[i].author.name + " " + (chalk.cyan(messages[i].author.bot ? texts.label.bot : texts.label.user)) + (" ".repeat(10 - messages[i].author.name.length)) + " " + messages[i].content.substr(0, process.stdout.columns || 2048));
    }
    let spacePad: number = state === 2 ? 3 : 2;
    console.log(("\n").repeat(messages.length > process.stdout.rows - spacePad ? 0 : process.stdout.rows - messages.length - spacePad) + (state === 2 ? client.language.texts.CHANNEL_BACK : `${client.language.texts.CHANNEL_SEND}\t${client.language.texts.CHANNEL_BROWSER}\t${client.language.texts.CHANNEL_RELOAD}`));
    if (state === 2) {
        console.log("―".repeat(process.stdout.columns));
        process.stdout.write("> ");
        if (channel.inputText !== "") process.stdout.write(channel.inputText);
    }
}