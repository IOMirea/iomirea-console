interface ResetOptions {
    border?: boolean,
    clear?: boolean
}

export default class ConsoleHelper {
    static iomirea: string = "  _____ ____  __  __ _\n |_   _/ __ \\|  \\/  (_)\n   | || |  | | \\  / |_ _ __ ___  __ _\n   | || |  | | |\\/| | | '__/ _ \\/ _` |\n  _| || |__| | |  | | | | |  __/ (_| |\n |_____\\____/|_|  |_|_|_|  \\___|\\__,_| v1.0\n";

    static reset(options: ResetOptions = { border: false, clear: true }): void {
        if (options.border === true) console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
        if (options.clear === true || options.clear === undefined) console.clear();
        console.log(ConsoleHelper.iomirea);
    }
}