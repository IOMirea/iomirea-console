import User from '../structures/User';
import ClientUser from "./ClientUser";

export default class Message {
    private _id: string;
    private _edit_id: string;
    private _channel_id: string;
    private _content: string;
    private _pinned: boolean;
    private _type: number;
    private _author: User|ClientUser;

    constructor(id: string, edit_id: string, channel_id: string, content: string, pinned: boolean, type: number, author: User|ClientUser) {
        this.id = id;
        this.edit_id = edit_id;
        this.channel_id = channel_id;
        this.content = content;
        this.pinned = pinned;
        this.type = type;
        this.author = author;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get edit_id(): string {
        return this._edit_id;
    }

    set edit_id(value: string) {
        this._edit_id = value;
    }

    get channel_id(): string {
        return this._channel_id;
    }

    set channel_id(value: string) {
        this._channel_id = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get pinned(): boolean {
        return this._pinned;
    }

    set pinned(value: boolean) {
        this._pinned = value;
    }

    get type(): number {
        return this._type;
    }

    set type(value: number) {
        this._type = value;
    }

    get author(): User|ClientUser {
        return this._author;
    }

    set author(value: User|ClientUser) {
        this._author = value;
    }
}