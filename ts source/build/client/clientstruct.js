"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const fs_1 = __importDefault(require("fs"));
const lexure = __importStar(require("lexure"));
class default_1 extends Discord.Client {
    constructor(config) {
        super({
            allowedMentions: { parse: ['users', 'roles'] },
            partials: ['MESSAGE', 'GUILD_MEMBER'],
            presence: config.presence
        });
        this.commands = new Discord.Collection();
        this.config = config;
        this.start = () => {
            if (!config.token)
                throw 'Please input a token!';
            this.login(config.token);
        };
        fs_1.default.readdir('./build/commands', (err, files) => {
            if (err)
                throw err;
            files.forEach((f) => {
                console.log(f);
                const command = require(`../commands/${f}`);
                this.commands.set(command.help.name, command.default);
            });
        });
        fs_1.default.readdir('./build/events', (err, files) => {
            if (err)
                throw err;
            files.forEach((f) => {
                const event = require(`../events/${f}`);
                const eventName = f.split('.')[0];
                this.on(eventName, event.bind(null, this));
            });
        });
        this.lex = (message) => {
            const lexer = new lexure.Lexer(message.content);
            const res = lexer.lexCommand(s => s.startsWith(this.config.prefix || '!') ? 1 : null);
            if (res == null)
                return;
            const cmd = this.commands.get(res[0].value)
                || this.commands.find(a => a.help.aliases && a.help.aliases.includes(res[0].value));
            if (!cmd)
                return;
            const tokens = res[1]();
            const parser = new lexure.Parser(tokens).setUnorderedStrategy(lexure.longStrategy());
            const out = parser.parse();
            const args = new lexure.Args(out);
            return { cmd, args };
        };
    }
}
exports.default = default_1;
