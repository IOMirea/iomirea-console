"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var formatDate_1 = require("./formatDate");
var Client_1 = require("../structures/Client");
function default_1(channel, client, state) {
    if (state === void 0) { state = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var messages, _a, i, time, spacePad;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (typeof channel === "string")
                        channel = client.channels.get(channel);
                    if (!(state === 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, channel.fetchMessages(true)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = channel.messages;
                    _b.label = 3;
                case 3:
                    messages = _a;
                    for (i = 0; i < messages.length; ++i) {
                        time = formatDate_1.default(Client_1.default.getTime(messages[i].id));
                        console.log("[" + time + "] " + (" ".repeat(15 - time.length)) + "│ " + messages[i].author.name + (" ".repeat(10 - messages[i].author.name.length)) + "│ " + messages[i].content.substr(0, process.stdout.columns || 2048));
                    }
                    spacePad = state === 2 ? 3 : 2;
                    console.log(("\n").repeat(messages.length > process.stdout.rows ? 0 : process.stdout.rows - messages.length - spacePad) + (state === 2 ? "[CTRL+C] Back" : "[X] Send Message\t[C] Back to Channel Browser\t[R] Force Reload"));
                    if (state === 2) {
                        console.log("―".repeat(process.stdout.columns));
                        process.stdout.write("> ");
                        if (channel.inputText !== "")
                            process.stdout.write(channel.inputText);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
