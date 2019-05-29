import chalk from "chalk";

interface ConsoleSelectorOptions {
    state?: number;
    limit?: number;
    contents?: Array<string>;
}

export default class ConsoleSelector {
    private _state: number;
    private _limit: number;
    private _contents: Array<string>;
    constructor(options: ConsoleSelectorOptions) {
        this.state = options.state;
        this.limit = options.limit;
        this.contents = options.contents;
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

    get contents(): Array<string> {
        return this._contents;
    }

    set contents(value: Array<string>) {
        this._contents = value;
    }

    log(s: number|string, ci: number) {
        let v: string;
        if (typeof s === "number") v = this.contents[s];
        else v = s;

        if (this.state - 1 === ci) console.log(chalk.inverse(v));
        else console.log(v);
    }
}