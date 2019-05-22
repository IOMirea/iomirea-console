module.exports = class Channel {
    constructor(id, name, owner_id, user_ids, pinned_ids, client) {
        this._id = id;
        this._name = name;
        this._owner_id = owner_id;
        this._user_ids = user_ids;
        this._pinned_ids = pinned_ids;
        this._client = client;
        this._messages = [];
    }

    get id() {
        return this._id;
    }

    set id(value) {
        return this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        return this._name = value;
    }

    get owner_id() {
        return this._owner_id;
    }

    set owner_id(value) {
        return this._owner_id = value;
    }

    get user_ids() {
        return this._user_ids;
    }

    set user_ids(value) {
        return this._user_ids = value;
    }

    get pinned_ids() {
        return this._pinned_ids;
    }

    set pinned_ids(value) {
        return this._pinned_ids = value;
    }

    get client() {
        return this._client;
    }

    set client(value) {
        return this._client = value;
    }

    get messages() {
        return this._messages;
    }

    set messages(value) {
        return this._messages = value;
    }

    fetchMessages(c) {
        return new Promise((resolve, reject) => {
            this.client.request(`channels/${this.id}/messages`, true).then(v => {
                if (c === true) this.messages = this.messages.concat(v); //TODO: fix memory leak
                resolve(v);
            }).catch(reject);
        });
    }

    refresh(r, c) {
        return new Promise((resolve, reject) => {
            this.fetchMessages(c).then(v => {
                resolve(r ? v : undefined);
            }).catch(reject);
        });
    }
};