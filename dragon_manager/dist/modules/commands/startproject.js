"use strict";
/**
 * Workflow for start a new project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const p = [];
class StartProject {
    constructor(params) {
        this._destDir = '';
    }
    static start(params) {
        return new StartProject(params);
    }
}
