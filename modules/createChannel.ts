import { Interface } from "readline";
import Channel from '../structures/Channel';
import chalk from "chalk";

/**
 * Creates a channel given by a name and recipients
 *
 * @param {Interface} rl Readline Interface
 * @returns {undefined}
 */
export default function(rl: Interface): void {
    // Use arrow function in callback to keep context as client instance
    rl.question(this.language.texts.CHANNEL_NAME_INPUT.f, name => {
        rl.question(this.language.texts.RECIPIENTS_ID_INPUT.f, recipients => {
            const user_ids = recipients.trim().split(/, */);
            if (user_ids.some(v => !/^\d+$/.test(v))) return console.log(this.language.texts.USERID_NOT_INT.f);
            Channel.create(this, {
                name,
                user_ids
            }).then((c: Channel) => {
                const channel: Channel = new Channel(c.id, c.name, c.owner_id, c.user_ids, c.pinned_ids, this);
                this.channels.set(channel.id, channel);
                console.log(this.language.texts.CHANNEL_CREATE_S.f);
            }).catch(e => {
                console.log(this.language.escape("CHANNEL_CREATE_E", {
                    err: e
                }, true));
            });
        });
    });
}