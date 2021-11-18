"use strict";
/**
 * Clasp facades.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
/**
 * Create new project.
 */
class ClaspFacade {
    static create(params) {
        let command = 'clasp create ';
        console.log(params);
        Object.entries(params).forEach((item) => {
            if (item[1])
                command += `--${item[0]} ${item[1]} `;
        });
        (0, child_process_1.execSync)(command.trim(), { stdio: 'inherit' });
    }
    /**
     * Clone project.
     */
    static clone() { }
    /**
     *
     */
    static pull() { }
    static push(params) {
        let command = 'clasp push ';
        if (params.force) {
            command += '--force ';
        }
        if (params.watch) {
            command += '--watch';
        }
        (0, child_process_1.execSync)(command.trim(), { stdio: 'inherit' });
    }
}
exports.default = ClaspFacade;
