interface ResetOptions {
    border?: boolean
}


export default class ConsoleHelper {
    static iomirea: string = "  _____ ____  __  __ _\n |_   _/ __ \\|  \\/  (_)\n   | || |  | | \\  / |_ _ __ ___  __ _\n   | || |  | | |\\/| | | '__/ _ \\/ _` |\n  _| || |__| | |  | | | | |  __/ (_| |\n |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n";

    static reset(options?: ResetOptions): void {
        console.clear();
        console.log(ConsoleHelper.iomirea);
        if (typeof options === "object") {
            if (options.border === true) console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
        }
    }
}