import { Interface } from "readline";
import Channel from '../structures/Channel';
import chalk from "chalk";

export default function(rl: Interface) {
    // Use arrow function in callback to keep context as client instance
    rl.question(chalk.green("Channel Name: "), name => {
        rl.question(chalk.green("Recipient IDs ") + chalk.yellow("(optional)") + chalk.green(" - seperate with comma: "), recipients => {
            Channel.create(this, {
                name,
                user_ids: recipients.trim().split(/, */)
            }).then((c: Channel) => {
                const channel: Channel = new Channel(c.id, c.name, c.owner_id, c.user_ids, c.pinned_ids, this);
                this.channels.set(channel.id, channel);
                console.log(chalk.green("Successfully created channel."));
            }).catch(e => {
                console.log(chalk.red("Could not create channel: " + e));
            });
        });
    });
}