/**
 * Workflow for start a new project.
 */

import FileHandler from '../files';
import Settings from '../../settings';
import { ArgumentParser } from 'argparse';
import { cwd, chdir } from 'process';
import { get as promptGet, start as promptStart } from 'prompt';
import ClaspFacade from '../clasp_facades';
import { join as joinPath, basename as basenamePath } from 'path';
import * as fse from 'fs-extra';
import PackageInstaller from '../package_installer';

type gasTypes =
  | 'standalone'
  | 'docs'
  | 'sheets'
  | 'slides'
  | 'forms'
  | 'webapp'
  | 'api';

interface ArgsInter {
  gasType: gasTypes;
  modules: string[];
  name: string;
  parentIdProd: string;
  parentIdDev: string;
}

export class CreateProject {
  private args: ArgsInter = {
    gasType: 'standalone',
    modules: [],
    name: '',
    parentIdProd: '',
    parentIdDev: '',
  };

  private workDir: string = '';

  private baseDir: string = '';

  private appDir: string = '';

  private prodDirTmp: string = '';

  private devDirTmp: string = '';

  private dsModulesDir: string = '';

  constructor(argParse: ArgumentParser) {
    this.run(argParse);
  }

  /**
   *
   * @param argParse {ArgumentParser}
   * @returns CreateProject instance.
   */
  public static create(argParse: ArgumentParser) {
    return new CreateProject(argParse);
  }

  private async run(argParse: ArgumentParser) {
    this.workDir = cwd();

    argParse.add_argument('-n', '--name', {
      help: 'Set project name',
      type: 'str',
      action: 'store',
    });

    argParse.add_argument('-t', '--type', {
      help: 'Choose GAS type:',
      type: 'str',
      action: 'store',
      choices: Settings.gasTypes,
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
      choices: Settings.dsModules,
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
  private async doQuestion(question: { [keys: string]: any }[]) {
    promptStart();
    const _question = await promptGet(question);
    return _question;
  }

  /**
   * Project Name
   */
  private async setProjectName() {
    let { name } = await this.doQuestion([
      {
        name: 'name',
        message: 'Project name',
        required: true,
      },
    ]);

    this.args.name = <string>name;
  }

  /**
   * GAS Type.
   */
  private async setGasType() {
    console.log(
      `GAS types: \n${Settings.gasTypes
        .map((v, i) => `  ${i}. ${v}\n`)
        .join('')}`
    );

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

      if (!Settings.gasTypes.map((v, i) => i).includes(Number(gasType))) {
        console.log(`ERROR: ${gasType} is not a valid option.`);
        continue;
      }

      if (gasType) {
        this.args.gasType = <gasTypes>Settings.gasTypes[Number(gasType)];
        break;
      }
    }
  }

  /**
   * Parent ID.
   */
  private async setParentId() {
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

    this.args.parentIdProd = <string>parentIdProd;
    this.args.parentIdDev = <string>parentIdDev;
  }

  /**
   * This function is executed if there is no DS module
   */
  private async setModules() {
    let instructions = `Select some module:\n${Settings.dsModules
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

      if (pkg === 'q') break;

      if (pkg === 's') {
        console.log(instructions);
        continue;
      }

      pkg = String(pkg).toLowerCase().trim();

      if (!Settings.dsModules.map((v, i) => i).includes(Number(pkg))) {
        console.log(`ERROR: ${pkg} is not a valid option.`);
        continue;
      }

      pkg = Settings.dsModules[Number(pkg)];

      if (!this.args.modules.includes(pkg)) {
        this.args.modules.push(pkg);
      }
    }

    console.log(`\nSelected DS Modules: ${this.args.modules.join(', ')}`);
  }

  /**
   * Install Node Modules.
   */
  private async installNodeModules() {
    chdir(this.baseDir);
    PackageInstaller.install();
  }

  /**
   * Creates project directory structure.
   */
  private async directoryStructure() {
    const projectName = this.args.name.replace(RegExp(' ', 'g'), '_');

    this.baseDir = joinPath(this.workDir, projectName);
    FileHandler.createDir(this.baseDir);

    this.appDir = joinPath(this.baseDir, 'app');
    FileHandler.createDir(this.appDir);

    this.prodDirTmp = joinPath(this.baseDir, `${projectName}_prod_tmp`);
    FileHandler.createDir(this.prodDirTmp);

    this.devDirTmp = joinPath(this.baseDir, `${projectName}_dev_tmp`);
    FileHandler.createDir(this.devDirTmp);

    this.dsModulesDir = joinPath(this.baseDir, 'ds_modules');
    FileHandler.createDir(this.dsModulesDir);

    const gasDir = joinPath(FileHandler.DragonManagerDir(), Settings.gasDir);

    const gasFiles = FileHandler.listDir(gasDir);

    gasFiles.forEach((file: string) => {
      const src = joinPath(gasDir, file);
      const dest = joinPath(this.baseDir, file);
      FileHandler.copyFile(src, dest, true);
    });
  }

  /**
   * Create Dev and Prod GAS projects.
   */
  private async createGASprojects() {
    const dragonConfig = joinPath(this.baseDir, 'dragonscript.config.json');

    const dragonConfigValues = FileHandler.readJSON(dragonConfig);

    const claspFile = joinPath(this.baseDir, '.clasp.json');

    if (fse.existsSync(claspFile)) {
      throw new Error('There is a GAS project already.');
      return;
    }

    if (!fse.existsSync(this.prodDirTmp)) {
      throw new Error(`Directory ${this.prodDirTmp} not exists.`);
    }

    // Create Gas Projects

    if (fse.existsSync(this.devDirTmp)) {
      chdir(this.prodDirTmp);

      ClaspFacade.create({
        title: `${basenamePath(this.baseDir)}_prod`,
        type: this.args.gasType,
        parentId: this.args.parentIdProd,
        rootDir: '',
      });

      const prodClaspValues = FileHandler.readJSON(
        joinPath(this.prodDirTmp, '.clasp.json')
      );
      dragonConfigValues['prod'] = prodClaspValues;
      dragonConfigValues['prod']['rootDir'] = this.appDir;
    }

    if (fse.existsSync(this.devDirTmp)) {
      chdir(this.devDirTmp);

      ClaspFacade.create({
        title: `${basenamePath(this.baseDir)}_dev`,
        type: this.args.gasType,
        parentId: this.args.parentIdDev,
        rootDir: '',
      });

      const devClaspValues = FileHandler.readJSON(
        joinPath(this.devDirTmp, '.clasp.json')
      );
      dragonConfigValues['dev'] = devClaspValues;
      dragonConfigValues['dev']['rootDir'] = this.appDir;

      FileHandler.copyFile(
        joinPath(this.devDirTmp, 'appsscript.json'),
        joinPath(this.appDir, 'appsscript.json')
      );
    }

    chdir(this.baseDir);

    FileHandler.writeJSON(dragonConfig, dragonConfigValues);

    FileHandler.writeJSON(claspFile, dragonConfigValues['dev']);

    FileHandler.remove(this.prodDirTmp);
    FileHandler.remove(this.devDirTmp);
  }

  /**
   * Put DS Modules.
   */
  private async dsModulesHandler() {
    const dsModules = joinPath(FileHandler.DragonManagerDir(), 'ds_modules');

    FileHandler.createDir(this.dsModulesDir);

    FileHandler.copyFile(joinPath(dsModules, 'Settings.ts'), this.appDir, true);

    FileHandler.copyFile(
      joinPath(dsModules, 'interfaces.ts'),
      this.dsModulesDir,
      true
    );

    for (const moduleName of this.args.modules) {
      FileHandler.copyDir(
        joinPath(dsModules, moduleName),
        joinPath(this.dsModulesDir, moduleName),
        true
      );
    }
  }
}
