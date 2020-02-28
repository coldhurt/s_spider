"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const concatArgs = (args) => {
    return Array.prototype.join.call(args, ' ');
};
const Log = {
    info: function (...optionalParams) {
        console.log(colors_1.default.gray('[*] ' + concatArgs(arguments)));
    },
    succ: function (...optionalParams) {
        console.log(colors_1.default.green('[+] ' + concatArgs(arguments)));
    },
    warn: function (...optionalParams) {
        console.log(colors_1.default.yellow('[!] ' + concatArgs(arguments)));
    },
    error: function (...optionalParams) {
        console.log(colors_1.default.red('[x] ' + concatArgs(arguments)));
    },
    logTime: function (f) {
        const start = new Date().getTime();
        f();
        const end = new Date().getTime();
        Log.info(`Total runtime ${(end - start) / 1000} s`);
    }
};
exports.Log = Log;
