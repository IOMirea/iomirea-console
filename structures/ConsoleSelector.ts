interface ConsoleSelectorOptions {
    state?: number;
    limit?: number;
}

export default class ConsoleSelector {
    private _state: number;
    private _limit: number;
    constructor(options: ConsoleSelectorOptions) {
        this.state = options.state;
        this.limit = options.limit;
    }

    get state(): number {
        return this._state;
    }

    set state(value: number) {
        this._state = value;
    }

    get limit(): number {
        return this._limit;
    }

    set limit(value: number) {
        this._limit = value;
    }
}