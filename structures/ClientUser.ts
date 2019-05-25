import User from './User';

export default class ClientUser extends User {
    private _email: string;

    constructor(id?: string, name?: string, bot?: boolean, email?: string) {
        super(id, name, bot);
        this.email = email;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
}