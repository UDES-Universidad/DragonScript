"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const settings_1 = __importDefault(require("../settings"));
class PackageInstaller {
    constructor() {
        this.npm = 'npm i';
    }
    static install() {
        const installer = new PackageInstaller();
        installer.execCommands();
    }
    commandBuilder(commandType, packages) {
        let _commandType = '-D';
        if (commandType === 'prod')
            _commandType = '-S';
        return [this.npm, _commandType, ...packages].join(' ').trim();
    }
    execCommands() {
        let commands = [
            this.commandBuilder('dev', [...settings_1.default.nodePackages_dev]),
            this.commandBuilder('prod', [...settings_1.default.nodePackages_prod]),
        ];
        for (const command of commands) {
            const stdout = (0, child_process_1.execSync)(command, { stdio: 'inherit' });
        }
    }
}
exports.default = PackageInstaller;
