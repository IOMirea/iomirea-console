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

    login(token) {
        return new Promise((resolve, reject) => {
            fetch(this.constructor.API_HOST + "users/@me/channels", {
                headers: {
                    "Authorization": token
                }
            }).then(async r => {
                if (r.status === 200) {
                    this.accessToken = token;
                    this._readyAt = Date.now();
                    const channels = await r.json();
                    for(let i=0; i < channels.length; ++i) {
                        const tempChannel = new Channel(channels[i].id, channels[i].name, channels[i].owner_id, channels[i].user_ids, channels[i].pinned_ids);
                        this.channels.set(channels.id, tempChannel);
                    }
                    this.emit("ready");
                    resolve(this);
                } else if (r.status === 401) {
                    r.text().then(reject);
                }
            });
        });
    }

    static get API_HOST() {
        return "https://iomirea.ml/api/v0/";
    }

    request(endpoint, json = false) {
        return new Promise((resolve, reject) => {
            fetch(/^https?:\/\//.test(endpoint) ? endpoint : this.constructor.API_HOST + endpoint, {
                headers: {
                    "Authorization": this.accessToken
                }
            }).then(r => {
                if (json === true) return r.json();
                else return r.text();
            }).then(resolve)
                .catch(reject);
        });
    }
};