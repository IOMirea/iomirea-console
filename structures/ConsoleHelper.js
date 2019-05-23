class ConsoleHelper {
    static get iomirea() {
        return `  _____ ____  __  __ _                
 |_   _/ __ \\|  \\/  (_)               
   | || |  | | \\  / |_ _ __ ___  __ _ 
   | || |  | | |\\/| | | '__/ _ \\/ _\` |
  _| || |__| | |  | | | | |  __/ (_| |
 |_____\\____/|_|  |_|_|_|  \\___|\\__,_|\n`;
    }
    static reset() {
        console.clear();
        console.log(ConsoleHelper.iomirea);
    }
}

module.exports = ConsoleHelper;