import Client from '../structures/Client';
import Channel from "../structures/Channel";

export default function(client: Client) {
    const channels: Array<Channel> = Array.from(client.channels.values());
    console.log("#\tChannel Name\t\t\tUsers\t\tID");
    console.log("―".repeat(process.stdout.columns < 60 ? process.stdout.columns : 60));
    for(let i: number = 0;i < channels.length; ++i) {
        console.log(`${i+1}\t${channels[i].name.substr(0, 24) + (channels[i].name.length > 24 ? "..." : ' '.repeat(24 - channels[i].name.length))}\t${channels[i].user_ids.length} Users \t${channels[i].id}`);
    }
    console.log("\n\nPress CTRL + C anytime to get back to the menu");
}