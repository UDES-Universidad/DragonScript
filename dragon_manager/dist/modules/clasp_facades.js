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
        let command = 'clasp create';
        Object.entries(params).forEach((item) => {
            if (item[1])
                command += `--${item[0]} ${item[1]}`;
        });
        (0, child_process_1.execSync)(command, { stdio: 'inherit' });
    }
    /**
     * Clone project.
     */
    static clone() { }
}
