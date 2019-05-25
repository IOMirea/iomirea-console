import fetch from 'node-fetch';
import Client from './Client';
import Timeout = NodeJS.Timeout;

export default class Channel {
    private _id: string;
    private _name: string;
    private _owner_id: string;
    private _user_ids: Array<string>;
    private _pinned_ids: Array<string>;
    private _client: Client;
    private _messages: Array<string> = [];
    private _messageHandler: Timeout = null;
    private _inputText: string = "";

    constructor(id, name, owner_id, user_ids, pinned_ids, client) {
        this.id = id;
        this.name = name;
        this.owner_id = owner_id;
        this.user_ids = user_ids;
        this.pinned_ids = pinned_ids;
        this.client = client;
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

    get messages(): Array<string> {
        return this._messages;
    }

    set messages(value: Array<string>) {
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

    fetchMessages(c: boolean): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            this.client.request(`channels/${this.id}/messages`, true).then(v => {
                if (c === true) this.messages = v;
                resolve(v);
            }).catch(reject);
        });
    }

    handleMessages(c: (msgs: Array<string>) => any, m: number) {
        this.messageHandler = setInterval(() => {
            this.fetchMessages(false).then(v => {
                if (typeof c === "function") c(v);
            });
        }, m);
    }

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
}