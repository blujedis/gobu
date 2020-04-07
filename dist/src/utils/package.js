"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const helpers_1 = require("./helpers");
async function readConfig(dir = helpers_1.root, filename = 'gobu.json') {
    const { err, data } = await helpers_1.promise(fs_extra_1.readFile(path_1.join(dir, filename)));
    if (err)
        return null;
    return JSON.parse((data || '').toString());
}
exports.readConfig = readConfig;
/**
 * Reads a package.json file by passing it's directory.
 *
 * @param dir the package directory.
 */
async function readPkg(dir = helpers_1.root) {
    const { err, data } = await helpers_1.promise(fs_extra_1.readFile(path_1.join(dir, 'package.json')));
    if (err)
        return null;
    return JSON.parse((data || '').toString());
}
exports.readPkg = readPkg;
/**
 * Writes a package.json file.
 *
 * @param data the object to be written.
 * @param dir the directory to write to.
 */
async function writePkg(data, dir = helpers_1.root) {
    const { err, data: result } = await helpers_1.promise(fs_extra_1.writeFile(path_1.join(dir, 'package.json'), data).then(res => true));
    if (err)
        return false;
    return true;
}
exports.writePkg = writePkg;
/**
 * Reads packages by directory roots.
 *
 * @param dirs the directories of packages to be read.
 */
async function readPkgs(dirs) {
    const result = await Promise.all(dirs.map(async (dir) => {
        const { err, data } = await helpers_1.promise(fs_extra_1.readFile(path_1.join(dir, 'package.json'), 'utf8'));
        if (err)
            return '';
        return JSON.parse(data.toString());
    }));
    return result.filter(v => !!v);
}
exports.readPkgs = readPkgs;
/**
 * Reads "scripts" keys by passing package directory roots.
 *
 * @param dirs package directories to load scripts from.
 */
async function readScripts(dirs) {
    const result = await readPkgs(dirs);
    return result.map(pkg => {
        return {
            scope: pkg.name,
            scripts: pkg.scripts || {}
        };
    });
}
exports.readScripts = readScripts;
//# sourceMappingURL=package.js.map