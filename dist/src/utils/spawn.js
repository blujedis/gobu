"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const spawn = cross_spawn_1.default;
exports.spawn = spawn;
const spawnSync = cross_spawn_1.default.sync;
exports.spawnSync = spawnSync;
//# sourceMappingURL=spawn.js.map