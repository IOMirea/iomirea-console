"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    console.log("―".repeat(process.stdout.columns < 50 ? process.stdout.columns : 50));
    console.log("1)\tView Channel");
    console.log("2)\tAccount Information");
    console.log("3)\tExit");
}
exports.default = default_1;
