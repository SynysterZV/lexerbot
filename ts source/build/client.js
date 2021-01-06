"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientstruct_1 = __importDefault(require("./client/clientstruct"));
const client = new clientstruct_1.default({

    presence: { activity: { type: 'PLAYING', name: 'with code' }, status: 'dnd' },
    prefix: '.'
});
client.start();
