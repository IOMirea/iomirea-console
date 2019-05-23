const formatDate = require("./formatDate").run;
const { getTime } = require("../structures/iomireaClient");

module.exports = {
    run: async (channel, client, state = 0) => {
        if (channel.constructor.name === "Number") channel = client.channels.get(channel);
        const messages = state === 0 ? await channel.fetchMessages(true) : channel.messages;
        for(let i=0;i<messages.length;++i) {
            const time = formatDate(getTime(messages[i].id));
            console.log("[" + time + "] " + (" ".repeat(15 - time.length)) + "│ " + messages[i].author.name + (" ".repeat(10 - messages[i].author.name.length)) + "│ " + messages[i].content.substr(0, process.stdout.columns || 2048));
        }
        const spacePad = state === 2 ? 3 : 2;
        console.log(("\n").repeat(messages.length > process.stdout.rows ? 0 : process.stdout.rows - messages.length - spacePad) + (state === 2 ? "[CTRL+C] Back" : "[X] Send Message\t[C] Back to Channel Browser\t[R] Force Reload"));

        if (state === 2) {
            console.log("―".repeat(process.stdout.columns));
            process.stdout.write("> ");
            if (channel.inputText !== "") process.stdout.write(channel.inputText);
        }
    }
};