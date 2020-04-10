"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const helpers_1 = require("./helpers");
async function read(path, asJSON) {
    if (!asJSON) {
        const { data } = await helpers_1.promise(fs_extra_1.readFile(path));
        return ((data && data.toString()) || null);
    }
    else {
        const { data } = await helpers_1.promise(fs_extra_1.readJSON(path));
        return (data || null);
    }
}
exports.read = read;
async function write(path, data, asJSON) {
    if (!asJSON) {
        const { err } = await helpers_1.promise(fs_extra_1.writeFile(path, data));
        if (err)
            return false;
    }
    else {
        const { err } = await helpers_1.promise(fs_extra_1.writeJSON(path, data));
        if (err)
            return false;
    }
    return true;
}
exports.write = write;
//# sourceMappingURL=file.js.map