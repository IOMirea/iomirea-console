// Structure and package imports
import * as readline from 'readline';
import * as fs from 'fs';
import chalk from "chalk";
import * as Constants from './structures/Constants'
import * as Language from './structures/Language'
import {
	writeFile
} from 'fs';
import Client from './structures/Client';
import ConsoleHelper from './structures/ConsoleHelper';
import Config from './structures/Config';
import Channel from './structures/Channel';
import ConsoleSelector from './structures/ConsoleSelector'

// Helper module imports
import formatDate from './modules/formatDate';
import showAccount from './modules/showAccount';
import showChannel from './modules/showChannel';
import showChannels from './modules/showChannels';
import showMenu from './modules/showMenu';
import showSettings from './modules/showSettings';
import writeConfig from './modules/writeConfig';
import createChannel from './modules/createChannel';
import {SettingsEntries} from "./structures/Constants";
const config: Config = { lang: "en" };
const client: Client = new Client();
// readline states
// Floating Point Error might occur if dynamic state
// -1 = Access Token Input
// 0 = Menu Selection
// 0.1 = Menu - View Channel
// 0.2 = Menu - Account Information
// 0.3 = Menu - Settings
// 0.4 = Menu - Exit
// 1 = View Channels
// 1.Z = View Channels (Index Z)
// 2 = Account Information
// 3 = Channel Browser
// 4 = Channel Browser (Send Message)
// 5 = Settings
// 6 = Settings (Change Access Token)
// 7 = Settings (Languages)
// 8 = Create Channel
let rlState: number = Constants.rlStates.MENU_SELECTION;
let tempInput: string = "";
let selector: ConsoleSelector = new ConsoleSelector({});
const rl: readline.Interface = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
fs.readFile("./.config", "utf8", (err, data) => {
	if (err) {
		console.log(chalk.red("An error occurred while trying to open .config"));
		process.exit(1);
	}
	let conf: Array < {
		key: string,
		value: string
	} > = data.split("\n").map(v => ({
		key: v.split("=")[0],
		value: v.substr(v.indexOf("=") + 1)
	}));

	if (conf.some(v => v.value.endsWith("\r"))) conf = conf.map(v => ({
		key: v.key,
		value: v.value.replace(/\r$/, "")
	}));
	for (const {
			key,
			value
		} of conf) {
		config[key] = value;
	}

	console.log(config.lang)

	// Language checking
	if (!/^\w+$/.test(config.lang)) {
		console.log(chalk.red("Invalid language format!"));
		process.exit(1);
	}

	if (!fs.readdirSync("./languages").includes(config.lang + ".json")) {
		console.log(chalk.red("Language not found!"));
		process.exit(1);
	}

	Object.defineProperty(client, "language", {
		value: new Language.default(require("./languages/" + config.lang + ".json"))
	});

	// Access Token checking
	if (!config.hasOwnProperty("ACCESS_TOKEN")) { // No access token provided
		rl.question("Access Token: ", r => {
			config.ACCESS_TOKEN = r;
			writeConfig(config).catch(err => {
				console.log(chalk.red(err));
			});
		});
	}

	client.login(config.ACCESS_TOKEN).catch(e => {
		const parsed: { message: string } = JSON.parse(e);
		if (config.ACCESS_TOKEN === "token")
			console.log(chalk.red("Error while logging in. Please replace `token` with your access token in the .config file"));
		else
			console.log(chalk.red("Error while logging in. " + (parsed.message || "Perhaps an invalid access token was provided?")));
		process.exit(1);
	});
});
console.clear();
console.log(chalk.yellow("Connecting..."));
client.on("ready", () => {
	console.log(chalk.green(`Connected! (${client.channels.size} Channels, ${((client.readyAt - client.instanceAt) / 1000).toFixed(2)}s)`));
	console.log(ConsoleHelper.iomirea);
	showMenu(rlState = Constants.rlStates.MENU_VIEW_CHANNEL);
});
process.stdin.on("keypress", async (str, {
	name
}) => {
	if (rlState >= Constants.rlStates.MENU_SELECTION && rlState < Constants.rlStates.VIEW_CHANNELS) {
		if (name === "down" || str === "s") {
			ConsoleHelper.reset();
			if (rlState === Constants.rlStates.MENU_SELECTION || rlState === Constants.rlStates.MENU_VIEW_CHANNEL) showMenu(rlState = Constants.rlStates.MENU_ACCOUNT_INFO);
			else if (rlState === Constants.rlStates.MENU_ACCOUNT_INFO) showMenu(rlState = Constants.rlStates.MENU_SETTINGS);
			else if (rlState === Constants.rlStates.MENU_SETTINGS) showMenu(rlState = Constants.rlStates.MENU_EXIT);
			else showMenu(rlState = Constants.rlStates.MENU_EXIT);
		} else if (name === "up" || str === "w") {
			ConsoleHelper.reset();
			if (rlState === Constants.rlStates.MENU_ACCOUNT_INFO) showMenu(rlState = Constants.rlStates.MENU_VIEW_CHANNEL);
			else if (rlState === Constants.rlStates.MENU_SETTINGS) showMenu(rlState = Constants.rlStates.MENU_ACCOUNT_INFO);
			else if (rlState === Constants.rlStates.MENU_EXIT) showMenu(rlState = Constants.rlStates.MENU_SETTINGS);
			else showMenu(rlState = Constants.rlStates.MENU_VIEW_CHANNEL);
		} else if (name === "return") {
			if (rlState !== Constants.rlStates.MENU_EXIT && rlState !== Constants.rlStates.MENU_VIEW_CHANNEL) ConsoleHelper.reset({
				border: true
			});
			else if (rlState === Constants.rlStates.MENU_VIEW_CHANNEL) ConsoleHelper.reset();
			if (rlState === Constants.rlStates.MENU_SELECTION || rlState === Constants.rlStates.MENU_VIEW_CHANNEL) {
                selector = new ConsoleSelector({
                    state: 1,
                    limit: client.channels.size
                });
				showChannels.call(client, selector);
				rlState = Constants.rlStates.VIEW_CHANNELS;
			} else if (rlState === Constants.rlStates.MENU_ACCOUNT_INFO) {
				rlState = Constants.rlStates.ACCOUNT_INFO;
				showAccount.call(client);
			} else if (rlState === Constants.rlStates.MENU_SETTINGS) {
				rlState = Constants.rlStates.SETTINGS;
                selector = new ConsoleSelector({
                    state: 1,
                    limit: Constants.SettingsEntries.length
                });
				showSettings(config, selector);
			} else if (rlState === Constants.rlStates.MENU_EXIT) process.exit(0);
		}
	} else if (rlState >= Constants.rlStates.VIEW_CHANNELS && rlState < Constants.rlStates.ACCOUNT_INFO) {
		if (name === "down" || str === "s") {
			if (selector.state >= client.channels.size) return;
			ConsoleHelper.reset();
			selector.state++;
			showChannels.call(client, selector);
		} else if (name === "up" || str === "w") {
			if (selector.state <= Constants.rlStates.VIEW_CHANNELS) return;
			ConsoleHelper.reset();
			selector.state--;
			showChannels.call(client, selector);
		} else if (name === "return") {
			const channel: Channel = client.activeChannel = Array.from(client.channels.values())[selector.state - 1];
			channel.handleMessages(msgs => {
				if (channel.messages.length !== msgs.length) {
					channel.messages = msgs;
					showChannel(channel, client, 0);
				}
			}, 2000);
			rlState = Constants.rlStates.CHANNEL_BROWSER;
			showChannel(channel, client, 0);
		} else if (str === "c") {

		    // TODO: Create Channel stuff
			rlState = Constants.rlStates.CREATE_CHANNEL;
			ConsoleHelper.reset();
            createChannel.call(client, rl);

        }
	} else if (rlState === Constants.rlStates.ACCOUNT_INFO) {
		ConsoleHelper.reset({
			border: true
		});
		showMenu(rlState = Constants.rlStates.MENU_VIEW_CHANNEL);
	} else if (rlState === Constants.rlStates.CHANNEL_BROWSER) {
		if (str === "x") {
			console.clear();
			showChannel(client.activeChannel, client, 2);
			rlState = Constants.rlStates.CHANNEL_BROWSER_SEND_MESSAGE;
		} else if (str === "c") {
			ConsoleHelper.reset();
			rlState = Constants.rlStates.VIEW_CHANNELS;
			clearInterval(client.activeChannel.messageHandler);
			client.activeChannel = null;
			showChannels.call(client, selector);
		} else if (str === "r") {
			client.activeChannel.fetchMessages(true).then(() => {
				console.clear();
				showChannel(client.activeChannel, client, 1);
			});
		}
	} else if (rlState === Constants.rlStates.CHANNEL_BROWSER_SEND_MESSAGE) {
		switch (name) {
			case "backspace":
				client.activeChannel.inputText = client.activeChannel.inputText.slice(0, -1);
				break;
			case "return":
				client.activeChannel.send().then(() => {
					client.activeChannel.inputText = "";
					console.clear();
					showChannel(client.activeChannel, client, 1);
					rlState = Constants.rlStates.CHANNEL_BROWSER;
				});
				break;
			default:
				client.activeChannel.inputText += str;
				break;
		}
	} else if (rlState === Constants.rlStates.SETTINGS) {

        if (name === "down" || str === "s") {
            if (selector.state >= SettingsEntries.length) return;
            ConsoleHelper.reset();
            selector.state++;
            showSettings(config, selector);
        } else if (name === "up" || str === "w") {
            if (selector.state <= 1) return;
            ConsoleHelper.reset();
            selector.state--;
            showSettings(config, selector);
        } else if (name === "return") {
        	switch (selector.state) {
				case 1:
                    process.stdout.write("\n" + chalk.yellow("New Access Token: "));
                    rlState = Constants.rlStates.SETTINGS_ACCESS_TOKEN;
                    break;

				case 2:
                    ConsoleHelper.reset({
                        border: true
                    });
                    console.log("Only English is supported for now.");
                    console.log("Press CTRL + C to go back");
					break;

				case 3:
					console.log(chalk.yellow("Changing Color Scheme is not supported in this version"));
					break;

				case 4:
                    ConsoleHelper.reset();
                    showMenu(rlState = Constants.rlStates.MENU_VIEW_CHANNEL);
                    rlState = Constants.rlStates.MENU_SELECTION;
                    break;
			}
        }
	} else if (rlState === Constants.rlStates.SETTINGS_ACCESS_TOKEN) {
		if (name === "return") {
			client.accessToken = tempInput;
			config.ACCESS_TOKEN = tempInput;
			writeConfig(config).then(() => {
				ConsoleHelper.reset();
				showSettings(config, selector);
				console.log(chalk.green("Successfully updated Access Token!"));
			}).catch(err => {
				console.log(chalk.red(err));
			});
			tempInput = "";
			rlState = Constants.rlStates.SETTINGS;
			return;
		} else if (name === "backspace") tempInput = tempInput.slice(0, -1);
		tempInput += str;
	}
});
rl.on("SIGINT", () => {
	if (rlState >= Constants.rlStates.MENU_SELECTION && rlState < Constants.rlStates.VIEW_CHANNELS) process.exit(0);
	if (rlState === Constants.rlStates.CHANNEL_BROWSER_SEND_MESSAGE) {
		console.clear();
		showChannel(client.activeChannel, client, 1);
		rlState = Constants.rlStates.CHANNEL_BROWSER;
		return;
	}
	client.removeActiveChannel();
	ConsoleHelper.reset();
	showMenu(rlState = Constants.rlStates.MENU_VIEW_CHANNEL);
	rlState = Constants.rlStates.MENU_SELECTION;
	tempInput = "";
});
