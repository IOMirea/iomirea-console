"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(client) {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log("ID\t\t" + client.user.id);
    console.log("Username\t" + client.user.name);
    console.log("E-Mail:\t\t" + client.user.email);
    console.log("(Press any key to go back)");
}
exports.default = default_1;
