export default class ConsoleSelector {
    private _state: number;
    constructor(state: number = null) {
        this.state = state;
    }

    get state(): number {
        return this._state;
    }

    set state(value: number) {
        this._state = value;
    }
}