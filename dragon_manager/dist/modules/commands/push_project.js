"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clasp_facades_1 = __importDefault(require("../clasp_facades"));
const files_1 = __importDefault(require("../files"));
const process_1 = require("process");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
/**
 *
 */
class PushProject {
    constructor(argParse) {
        this.args = {
            force: false,
            watch: false,
            prod: false,
            dev: false,
        };
        this.currentDir = '';
        this.currentDir = (0, process_1.cwd)();
        this.isGASdir();
        this.run(argParse);
    }
    static create(argParse) {
        return new PushProject(argParse);
    }
    isGASdir() {
        const claspFile = (0, path_1.join)(this.currentDir, '.clasp.json');
        if (!(0, fs_extra_1.existsSync)(claspFile)) {
            console.log('This directory not seems contains a DragonScript project.');
            (0, process_1.exit)(1);
        }
    }
    /**
     *
     * @param argParse
     */
    async run(argParse) {
        argParse.add_argument('-f', '--force', {
            action: 'store_true',
            help: 'Forcibly overwrites the remote manifest.',
        });
        argParse.add_argument('-w', '--watch', {
            action: 'store_true',
            help: 'Watches local file changes. Pushes files every few seconds.',
        });
        argParse.add_argument('-p', '--prod', {
            action: 'store_true',
            help: 'CAUTION: Push code to production.',
        });
        argParse.add_argument('-d', '--dev', {
            action: 'store_true',
            default: true,
            help: 'Push code to develop.',
        });
        const args = argParse.parse_args();
        this.args.force = args.force;
        this.args.watch = args.watch;
        this.args.prod = args.prod;
        this.args.dev = args.dev;
        await this.selectMode();
        await this.execCommand();
    }
    /**
     *
     */
    async execCommand() {
        clasp_facades_1.default.push(this.args);
    }
    /**
     *
     * @returns
     */
    async selectMode() {
        const dragonScriptConf = (0, path_1.join)(this.currentDir, 'dragonscript.config.json');
        const dsValues = files_1.default.readJSON(dragonScriptConf);
        const claspFile = (0, path_1.join)(this.currentDir, '.clasp.json');
        if (this.args.prod) {
            files_1.default.writeJSON(claspFile, dsValues.prod);
            return;
        }
        else if (this.args.dev && !this.args.prod) {
            files_1.default.writeJSON(claspFile, dsValues.dev);
            return;
        }
        else if (this.args.dev && this.args.prod) {
            console.log('ERROR: Choose "prod" or "dev".');
            return;
        }
    }
}
exports.default = PushProject;
