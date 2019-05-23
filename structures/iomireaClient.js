const { EventEmitter } = require('events');
const fetch = require("node-fetch");
const Channel = require("./Channel");

module.exports = class Client extends EventEmitter {
    constructor(options) {
        super();
        this._channels = new Map();
        this._users = new Map();
        this._accessToken;
        this._instanceAt = Date.now();
        this._readyAt = null;
        this._user = null;
        this._activeChannel = null;
    }

    get channels() {
        return this._channels;
    }

    set channels(value) {
        return this._channels = value;
    }

    get users() {
        return this._users;
    }

    set users(value) {
        return this._users = value;
    }

    get accessToken() {
        return this._accessToken;
    }

    set accessToken(value) {
        return this._accessToken = value;
    }

    get instanceAt() {
        return this._instanceAt;
    }

    get uptime() {
        return Date.now() - this.readyAt;
    }

    get readyAt() {
        return this._readyAt;
    }

    get user() {
        return this._user;
    }

    set user(value) {
        return this._user = value;
    }

    get activeChannel() {
        return this._activeChannel;
    }

    set activeChannel(value) {
        return this._activeChannel = value;
    }

    static get API_HOST() {
        return "https://iomirea.ml/api/v0/";
    }

    login(token) {
        return new Promise((resolve, reject) => {
            fetch(this.constructor.API_HOST + "users/@me/channels", {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            }).then(async r => {
                if (r.status === 200) {
                    this.accessToken = token;
                    this._readyAt = Date.now();
                    const channels = await r.json();
                    for(let i=0; i < channels.length; ++i) {
                        const tempChannel = new Channel(channels[i].id, channels[i].name, channels[i].owner_id, channels[i].user_ids, channels[i].pinned_ids, this);
                        this.channels.set(tempChannel.id, tempChannel);
                    }
                    await this.fetchUser("@me").then(u => {
                            this.user = u;
                            this.users.set(u.id, u);
                    });
                    this.emit("ready");
                    resolve(this);
                } else if (r.status === 401) {
                    r.text().then(reject);
                }
            });
        });
    }

    request(endpoint, json = false, method = "GET") {
        return new Promise((resolve, reject) => {
            fetch(/^https?:\/\//.test(endpoint) ? endpoint : this.constructor.API_HOST + endpoint, {
                headers: {
                    "Authorization": this.accessToken
                },
                method: method
            }).then(r => {
                if (json === true) return r.json();
                else return r.text();
            }).then(resolve)
                .catch(reject);
        });
    }

    fetchUser(user) {
        return new Promise((resolve, reject) => {
            this.request(`users/${user}`, true).then(v => {
                resolve(v);
            }).catch(reject);
        });
    }

    removeActiveChannel() {
        if (this.activeChannel instanceof Channel) clearInterval(this.activeChannel.messageHandler);
        this.activeChannel = null;
    }

    static getTime(snowflake) {
        return parseInt(1546300800n+(BigInt(snowflake) >> 22n)/1000n)*1000;
    }
};