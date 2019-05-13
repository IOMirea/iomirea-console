class ConsoleHelper {
    static clear(std) {
        (std || console.log)('\033[2J');
    }
}

module.exports = ConsoleHelper;