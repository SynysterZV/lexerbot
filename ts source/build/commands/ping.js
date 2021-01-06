"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
exports.help = {
    name: "ping",
    desc: "example"
};
exports.default = (message) => {
    message.channel.send('Pong');
};
