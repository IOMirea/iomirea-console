module.exports = class Channel {
    constructor(id, name, owner_id, user_ids, pinned_ids) {
        this._id = id;
        this._name = name;
        this._owner_id = owner_id;
        this._user_ids = user_ids;
        this._pinned_ids = pinned_ids;
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

    get pinnged_ids() {
        return this._pinned_ids;
    }

    set pinned_ids(value) {
        return this._pinned_ids = value;
    }
};