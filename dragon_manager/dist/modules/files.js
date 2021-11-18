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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fse = __importStar(require("fs-extra"));
/**
 * Handle all file and directory operations.
 */
class FileHandler {
    /**
     *
     * @param steps {number}
     * @returns {string} directory name.
     */
    static getNestedDir(steps) {
        let dirName = '';
        for (let i = 1; i < steps; i++) {
            if (i === 1) {
                dirName = __dirname;
            }
            else {
                dirName = path.dirname(dirName);
            }
        }
        return dirName;
    }
    /**
     *
     * @returns Returns current directory.
     */
    static DragonManagerDir() {
        return FileHandler.getNestedDir(5);
    }
    /**
     * Copy file.
     */
    static async copyFile(src, dest, verbose = false) {
        const fileName = path.basename(src);
        try {
            await fse.copyFile(src, dest, fse.constants.COPYFILE_EXCL);
            if (verbose)
                console.log(`COPY SUCCESS: File ${src} -> ${dest}`);
            return true;
        }
        catch (e) {
            if (verbose)
                console.log(e.message);
            return false;
        }
    }
    /**
     * Copy directories.
     */
    static async copyDir(src, dest, verbose = false) {
        try {
            fse.copy(src, dest);
            console.log(`$`);
            if (verbose)
                console.log(`COPY SUCCESS: ${src} -> ${dest}.`);
            return true;
        }
        catch (e) {
            if (verbose)
                console.log(e.message);
            return false;
        }
    }
    /**
     * Create a directory.
     */
    static createDir(dir) {
        const dirExists = fse.existsSync(dir);
        if (!dirExists)
            fse.mkdirSync(dir, { recursive: true });
    }
    /**
     * Move files.
     */
    static moveFile(src, dest) {
        const destDirName = path.dirname(dest);
        if (fse.existsSync(src) && destDirName) {
            fse.renameSync(src, dest);
        }
    }
    /**
     * Remove file or directory
     * @param src {string}
     */
    static remove(src) {
        if (fse.existsSync(src)) {
            fse.removeSync(src);
        }
    }
    /**
     *
     * @param dir {string} Target directory
     * @returns {string []}: Array of files.
     */
    static listDir(dir) {
        if (fse.existsSync(dir)) {
            return fse.readdirSync(dir);
        }
        else {
            throw new Error('lisDir: Directory not exists.');
        }
    }
    static readJSON(fileName) {
        return fse.readJsonSync(fileName, {
            encoding: 'utf-8',
        });
    }
    static writeJSON(fileName, data) {
        fse.writeJSONSync(fileName, data, {
            spaces: 2,
        });
    }
}
exports.default = FileHandler;
