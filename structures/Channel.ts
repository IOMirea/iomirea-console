import fetch from 'node-fetch';
import Client from './Client';
import Timeout = NodeJS.Timeout;
import Message from '../structures/Message'

interface ChannelData {
    name: string;
    user_ids: Array<string>;
}

export default class Channel {
    private _id: string;
    private _name: string;
    private _owner_id: string;
    private _user_ids: Array<string>;
    private _pinned_ids: Array<string>;
    private _client: Client;
    private _messages: Array<Message> = [];
    private _messageHandler: Timeout = null;
    private _inputText: string = "";

    constructor(id: string, name: string, owner_id: string, user_ids: Array<string>, pinned_ids: Array<string>, client: Client) {
        this._id = id;
        this._name = name;
        this._owner_id = owner_id;
        this._user_ids = user_ids;
        this._pinned_ids = pinned_ids;
        this._client = client;
    }

    // Getters/Setters
    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get owner_id(): string {
        return this._owner_id;
    }

    set owner_id(value: string) {
        this._owner_id = value;
    }

    get user_ids(): Array<string> {
        return this._user_ids;
    }

    set user_ids(value: Array<string>) {
        this._user_ids = value;
    }

    get pinned_ids(): Array<string> {
        return this._pinned_ids;
    }

    set pinned_ids(value: Array<string>) {
        this._pinned_ids = value;
    }

    get client(): Client {
        return this._client;
    }

    set client(value: Client) {
        this._client = value;
    }

    get messages(): Array<Message> {
        return this._messages;
    }

    set messages(value: Array<Message>) {
        this._messages = value;
    }

    get messageHandler(): Timeout {
        return this._messageHandler;
    }

    set messageHandler(value: Timeout) {
        this._messageHandler = value;
    }

    get inputText(): string {
        return this._inputText;
    }

    set inputText(value: string) {
        this._inputText = value;
    }

    /**
     * Fetches messages in this channel
     *
     * @param {boolean} c Cache messages
     * @returns {Promise<Array<Message>>}
     */
    fetchMessages(c: boolean): Promise<Array<Message>> {
        return new Promise((resolve, reject) => {
            this.client.request(`channels/${this.id}/messages`, true).then(v => {
                if (c === true) this.messages = v;
                resolve(v);
            }).catch(reject);
        });
    }

    /**
     * Fetches messages in this channel
     *
     * @param {function} c Callback function
     * @param {number} m Timeout
     * @returns {undefined}
     */
    handleMessages(c: (msgs: Array<Message>) => any, m: number) {
        this.messageHandler = setInterval(() => {
            this.fetchMessages(false).then(v => {
                if (typeof c === "function") c(v);
            });
        }, m);
    }

    /**
     * Send a message to this channel
     *
     * @param {string?} content Message content, uses inputText cache by default
     * @returns {Promise<string>}
     */
    send(content: string = this.inputText) : Promise<string> {
        return new Promise((resolve, reject) => {
            fetch(`${Client.API_HOST}channels/${this.id}/messages`, {
                headers: {
                    "Authorization": this.client.accessToken,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ content })
            }).catch(reject).then(r => r.text()).then(resolve);
        });
    };

    /**
     * Creates a channel
     *
     * @static
     * @param {Client} client The client instance
     * @param {ChannelData} data Channel data for the channel that should be created
     * @returns {Promise<*>}
     */
    static create(client: Client, data: ChannelData): Promise<any> {
        return new Promise((resolve, reject) => {
            const {name, user_ids} = data;
            client.request("channels", true, "POST", {
                name,
                recipients: user_ids.filter(v => v !== "")
            }, {
                "Content-type": "application/json"
            }).then(c => {
                resolve(c);
            }).catch(reject);
        });
    }
}