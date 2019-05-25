export default class User {
    private _id: string;
    private _name: string;
    private _bot: boolean;

    constructor(id?: string, name?: string, bot?: boolean) {
        this.id = id;
        this.name = name;
        this.bot = bot;
    }

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

    get bot(): boolean {
        return this._bot;
    }

    set bot(value: boolean) {
        this._bot = value;
    }
}