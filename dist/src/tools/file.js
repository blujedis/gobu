"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const helpers_1 = require("../utils/helpers");
async function read(path, asJSON) {
    if (!asJSON) {
        const { data } = await helpers_1.promise(util_1.promisify(fs_1.readFile)(path));
        return ((data && data.toString()) || null);
    }
    else {
        const { data } = await helpers_1.promise(util_1.promisify(fs_1.readFile)(path));
        if (!data)
            return null;
        return (JSON.parse(data.toString()));
    }
}
exports.read = read;
async function write(path, data, asJSON) {
    if (!asJSON) {
        const { err } = await helpers_1.promise(util_1.promisify(fs_1.writeFile)(path, data));
        if (err)
            return false;
    }
    else {
        const { err } = await helpers_1.promise(util_1.promisify(fs_1.writeFile)(path, JSON.stringify(data, null, 2)));
        if (err)
            return false;
    }
    return true;
}
exports.write = write;
//# sourceMappingURL=file.js.map