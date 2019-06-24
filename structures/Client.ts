import { EventEmitter } from 'events';
import Channel from './Channel';
import User from './User';
import ClientUser from './ClientUser';
import fetch from 'node-fetch';

export default class Client extends EventEmitter {
    private _channels: Map<string, Channel> = new Map();
    private _users: Map<string, User> = new Map();
    private _accessToken: string;
    private _instanceAt: number = Date.now();
    private _readyAt: number = null;
    private _user: ClientUser = null;
    private _activeChannel: Channel = null;
    static API_HOST: string = "https://iomirea.ml/api/v0/";

    constructor() {
        super();
    }

    // Getters/Setters
    get channels(): Map<string, Channel> {
        return this._channels;
    }

    set channels(value: Map<string, Channel>) {
        this._channels = value;
    }

    get users(): Map<string, User> {
        return this._users;
    }

    set users(value: Map<string, User>) {
        this._users = value;
    }

    get accessToken(): string {
        return this._accessToken;
    }

    set accessToken(value: string) {
        this._accessToken = value;
    }

    get instanceAt(): number {
        return this._instanceAt;
    }

    set instanceAt(value: number) {
        this._instanceAt = value;
    }

    get readyAt(): number {
        return this._readyAt;
    }

    set readyAt(value: number) {
        this._readyAt = value;
    }

    get user(): ClientUser {
        return this._user;
    }

    set user(value: ClientUser) {
        this._user = value;
    }

    get activeChannel(): Channel {
        return this._activeChannel;
    }

    set activeChannel(value: Channel) {
        this._activeChannel = value;
    }

    get uptime(): number {
        return Date.now() - this.readyAt;
    }

    // Methods
    login(token: string): Promise<Client> {
        return new Promise((resolve, reject) => {
            fetch(Client.API_HOST + "users/@me/channels", {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            }).then(async r => {
                if (r.status === 200) {
                    this.accessToken = token;
                    this.readyAt = Date.now();
                    const channels: Array<Channel> = await r.json();
                    for(let i: number = 0; i < channels.length; ++i) {
                        const tempChannel: Channel = new Channel(channels[i].id, channels[i].name, channels[i].owner_id, channels[i].user_ids, channels[i].pinned_ids, this);
                        this.channels.set(tempChannel.id, tempChannel);
                    }
                    await this.fetchUser("@me").then(u => {
                        const user = new ClientUser(u.id, u.name, u.bot, u.email);
                        this.user = user;
                        this.users.set(user.id, user);
                    });
                    this.emit("ready");
                    resolve(this);
                } else if (r.status === 401) {
                    r.text().then(reject);
                }
            });
        });
    }

    request(endpoint: string, json: boolean = false, method: string = "GET", body?: any, headers: any = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(/^https?:\/\//.test(endpoint) ? endpoint : Client.API_HOST + endpoint.replace(/^\//, ""), {
                headers: {
                    "Authorization": this.accessToken,
                     ...headers
                },
                body: body ? JSON.stringify(body) : undefined,
                method
            }).then(r => {
                if (json === true) return r.json();
                else return r.text();
            }).then(resolve)
                .catch(reject);
        });
    }

    fetchUser(user: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.request(`users/${user}`, true).then(resolve).catch(reject);
        });
    }

    removeActiveChannel(): void {
        if (this.activeChannel instanceof Channel) clearInterval(this.activeChannel.messageHandler);
        this.activeChannel = null;
    }

    static getTime(snowflake: string) {
        // @ts-ignore
        return parseInt(BigInt(1546300800) + (BigInt(snowflake) >> BigInt(22)) / BigInt(1000)) * 1000;
    }
}