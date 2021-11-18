"use strict";
/**
 * Workflow for start a new project.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const files_1 = __importDefault(require("../files"));
const settings_1 = __importDefault(require("../../settings"));
const process_1 = require("process");
const prompt_1 = require("prompt");
const clasp_facades_1 = __importDefault(require("../clasp_facades"));
const path_1 = require("path");
const fse = __importStar(require("fs-extra"));
const package_installer_1 = __importDefault(require("../package_installer"));
class CreateProject {
    constructor(argParse) {
        this.args = {
            gasType: 'standalone',
            modules: [],
            name: '',
            parentIdProd: '',
            parentIdDev: '',
        };
        this.workDir = '';
        this.baseDir = '';
        this.appDir = '';
        this.prodDirTmp = '';
        this.devDirTmp = '';
        this.dsModulesDir = '';
        this.run(argParse);
    }
    /**
     *
     * @param argParse {ArgumentParser}
     * @returns CreateProject instance.
     */
    static create(argParse) {
        return new CreateProject(argParse);
    }
    async run(argParse) {
        this.workDir = (0, process_1.cwd)();
        argParse.add_argument('-n', '--name', {
            help: 'Set project name',
            type: 'str',
            action: 'store',
        });
        argParse.add_argument('-t', '--type', {
            help: 'Choose GAS type:',
            type: 'str',
            action: 'store',
            choices: settings_1.default.gasTypes,
        });
        argParse.add_argument('-p', '--parentId', {
            help: 'Parent ID',
            type: 'str',
            action: 'store',
        });
        argParse.add_argument('-m', '--modules', {
            help: 'Choose some DragonScript modules',
            type: 'str',
            action: 'append',
            choices: settings_1.default.dsModules,
        });
        const argsParse = argParse.parse_args();
        this.args['name'] = argsParse.name;
        this.args['parentIdProd'] = argsParse.parentId;
        this.args['gasType'] = argsParse.type;
        this.args['modules'] = argsParse.modules ? argsParse.modules : [];
        if (!this.args['name']) {
            this.args.name = '';
            await this.setProjectName();
        }
        if (!this.args['gasType']) {
            this.args.gasType = 'standalone';
            await this.setGasType();
        }
        if (!this.args['parentIdProd']) {
            await this.setParentId();
        }
        if (this.args.modules.length < 1) {
            await this.setModules();
        }
        await this.directoryStructure();
        await this.installNodeModules();
        await this.createGASprojects();
        await this.dsModulesHandler();
    }
    /**
     *
     * @param question {string}: Question to show.
     */
    async doQuestion(question) {
        (0, prompt_1.start)();
        const _question = await (0, prompt_1.get)(question);
        return _question;
    }
    /**
     * Project Name
     */
    async setProjectName() {
        let { name } = await this.doQuestion([
            {
                name: 'name',
                message: 'Project name',
                required: true,
            },
        ]);
        this.args.name = name;
    }
    /**
     * GAS Type.
     */
    async setGasType() {
        console.log(`GAS types: \n${settings_1.default.gasTypes
            .map((v, i) => `  ${i}. ${v}\n`)
            .join('')}`);
        while (true) {
            let { gasType } = await this.doQuestion([
                {
                    name: 'gasType',
                    message: 'Select GAS type',
                    required: true,
                },
            ]);
            if (!gasType) {
                console.log('Enter a GAS type.');
            }
            if (!settings_1.default.gasTypes.map((v, i) => i).includes(Number(gasType))) {
                console.log(`ERROR: ${gasType} is not a valid option.`);
                continue;
            }
            if (gasType) {
                this.args.gasType = settings_1.default.gasTypes[Number(gasType)];
                break;
            }
        }
    }
    /**
     * Parent ID.
     */
    async setParentId() {
        let { parentIdProd, parentIdDev } = await this.doQuestion([
            {
                name: 'parentIdProd (Optional)',
                message: 'Enter parent file ID',
            },
            {
                name: 'parentIdDev (Optional)',
                message: 'Enter parent file ID for develop',
            },
        ]);
        this.args.parentIdProd = parentIdProd;
        this.args.parentIdDev = parentIdDev;
    }
    /**
     * This function is executed if there is no DS module
     */
    async setModules() {
        let instructions = `Select some module:\n${settings_1.default.dsModules
            .sort()
            .map((v, i) => `  ${i}. ${v}`)
            .join('\n')}`;
        instructions = `${instructions}\n  q: omit / quit \n  s: show modules`;
        console.log(instructions);
        while (true) {
            let { pkg } = await this.doQuestion([
                {
                    name: 'pkg',
                    message: 'Select module number',
                },
            ]);
            if (pkg === 'q')
                break;
            if (pkg === 's') {
                console.log(instructions);
                continue;
            }
            pkg = String(pkg).toLowerCase().trim();
            if (!settings_1.default.dsModules.map((v, i) => i).includes(Number(pkg))) {
                console.log(`ERROR: ${pkg} is not a valid option.`);
                continue;
            }
            pkg = settings_1.default.dsModules[Number(pkg)];
            if (!this.args.modules.includes(pkg)) {
                this.args.modules.push(pkg);
            }
        }
        console.log(`\nSelected DS Modules: ${this.args.modules.join(', ')}`);
    }
    /**
     * Install Node Modules.
     */
    async installNodeModules() {
        (0, process_1.chdir)(this.baseDir);
        package_installer_1.default.install();
    }
    /**
     * Creates project directory structure.
     */
    async directoryStructure() {
        const projectName = this.args.name.replace(RegExp(' ', 'g'), '_');
        this.baseDir = (0, path_1.join)(this.workDir, projectName);
        files_1.default.createDir(this.baseDir);
        this.appDir = (0, path_1.join)(this.baseDir, 'app');
        files_1.default.createDir(this.appDir);
        this.prodDirTmp = (0, path_1.join)(this.baseDir, `${projectName}_prod_tmp`);
        files_1.default.createDir(this.prodDirTmp);
        this.devDirTmp = (0, path_1.join)(this.baseDir, `${projectName}_dev_tmp`);
        files_1.default.createDir(this.devDirTmp);
        this.dsModulesDir = (0, path_1.join)(this.baseDir, 'ds_modules');
        files_1.default.createDir(this.dsModulesDir);
        const gasDir = (0, path_1.join)(files_1.default.DragonManagerDir(), settings_1.default.gasDir);
        const gasFiles = files_1.default.listDir(gasDir);
        gasFiles.forEach((file) => {
            const src = (0, path_1.join)(gasDir, file);
            const dest = (0, path_1.join)(this.baseDir, file);
            files_1.default.copyFile(src, dest, true);
        });
    }
    /**
     * Create Dev and Prod GAS projects.
     */
    async createGASprojects() {
        const dragonConfig = (0, path_1.join)(this.baseDir, 'dragonscript.config.json');
        const dragonConfigValues = files_1.default.readJSON(dragonConfig);
        const claspFile = (0, path_1.join)(this.baseDir, '.clasp.json');
        if (fse.existsSync(claspFile)) {
            throw new Error('There is a GAS project already.');
            return;
        }
        if (!fse.existsSync(this.prodDirTmp)) {
            throw new Error(`Directory ${this.prodDirTmp} not exists.`);
        }
        // Create Gas Projects
        if (fse.existsSync(this.devDirTmp)) {
            (0, process_1.chdir)(this.prodDirTmp);
            clasp_facades_1.default.create({
                title: `${(0, path_1.basename)(this.baseDir)}_prod`,
                type: this.args.gasType,
                parentId: this.args.parentIdProd,
                rootDir: '',
            });
            const prodClaspValues = files_1.default.readJSON((0, path_1.join)(this.prodDirTmp, '.clasp.json'));
            dragonConfigValues['prod'] = prodClaspValues;
            dragonConfigValues['prod']['rootDir'] = this.appDir;
        }
        if (fse.existsSync(this.devDirTmp)) {
            (0, process_1.chdir)(this.devDirTmp);
            clasp_facades_1.default.create({
                title: `${(0, path_1.basename)(this.baseDir)}_dev`,
                type: this.args.gasType,
                parentId: this.args.parentIdDev,
                rootDir: '',
            });
            const devClaspValues = files_1.default.readJSON((0, path_1.join)(this.devDirTmp, '.clasp.json'));
            dragonConfigValues['dev'] = devClaspValues;
            dragonConfigValues['dev']['rootDir'] = this.appDir;
            files_1.default.copyFile((0, path_1.join)(this.devDirTmp, 'appsscript.json'), (0, path_1.join)(this.appDir, 'appsscript.json'));
        }
        (0, process_1.chdir)(this.baseDir);
        files_1.default.writeJSON(dragonConfig, dragonConfigValues);
        files_1.default.writeJSON(claspFile, dragonConfigValues['dev']);
        files_1.default.remove(this.prodDirTmp);
        files_1.default.remove(this.devDirTmp);
    }
    /**
     * Put DS Modules.
     */
    async dsModulesHandler() {
        const dsModules = (0, path_1.join)(files_1.default.DragonManagerDir(), 'ds_modules');
        files_1.default.createDir(this.dsModulesDir);
        files_1.default.copyFile((0, path_1.join)(dsModules, 'Settings.ts'), this.appDir, true);
        files_1.default.copyFile((0, path_1.join)(dsModules, 'interfaces.ts'), this.dsModulesDir, true);
        for (const moduleName of this.args.modules) {
            files_1.default.copyDir((0, path_1.join)(dsModules, moduleName), (0, path_1.join)(this.dsModulesDir, moduleName), true);
        }
    }
}
exports.default = CreateProject;
