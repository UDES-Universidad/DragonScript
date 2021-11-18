"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragonStarter = void 0;
const argparse_1 = require("argparse");
const process_1 = require("process");
const create_project_1 = __importDefault(require("./commands/create_project"));
const push_project_1 = __importDefault(require("./commands/push_project"));
class DragonStarter {
    constructor() {
        this.currentDir = (0, process_1.cwd)();
        this.argParse = new argparse_1.ArgumentParser({
            description: '🔥️ DragonScript, GAS supercharged 🔥️!!!',
        });
        const mainCommand = process_1.argv[2];
        this.argParse.add_argument('type', {
            help: 'Execute GAS action.',
            type: 'str',
            choices: ['create', 'pull', 'push'],
        });
        let notArgument = true;
        if (mainCommand === 'create') {
            this.create();
            notArgument = false;
        }
        else if (mainCommand === 'pull') {
            this.pull();
            notArgument = false;
        }
        else if (mainCommand === 'push') {
            this.push();
            notArgument = false;
        }
        if (notArgument)
            this.argParse.parse_args();
    }
    static start() {
        return new DragonStarter();
    }
    create() {
        create_project_1.default.create(this.argParse);
    }
    pull() { }
    push() {
        push_project_1.default.create(this.argParse);
    }
}
exports.DragonStarter = DragonStarter;
