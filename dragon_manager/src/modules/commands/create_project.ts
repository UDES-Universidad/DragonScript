/**
 * Workflow for start a new project.
 */

import FileHandler from '../files';
import Settings from '../../settings';
import { ArgumentParser } from 'argparse';
import { exit, stdin, stdout, cwd, chdir } from 'process';
import { get as promptGet, start as promptStart } from 'prompt';
import ClaspFacade from '../clasp_facades';
import { join as joinPath, basename as basenamePath } from 'path';
import * as fse from 'fs-extra';

interface ArgsInter {
  gasType: string;
  modules: string[];
  name: string;
  parentIdProd: string;
  parentIdDev: string;
}

export class CreateProject {
  private args: ArgsInter = {
    gasType: '',
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

    this.args = argParse.parse_args();

    if (!this.args['name']) {
      this.args.name = '';
      await this.setProjectName();
    }

    if (!this.args['gasType']) {
      this.args.gasType = '';
      await this.setGasType();
    }

    if (!this.args['parentIdProd']) {
      this.args.modules = [];
      await this.setParentId();
    }

    if (!this.args['modules'] || this.args.modules.length < 1) {
      this.args.modules = [];
      await this.setModules();
    }

    this.directoryStructure();
    this.createGASprojects();
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

  private async setGasType() {
    console.log(`GAS types: ${Settings.gasTypes.join(', ').trim()}`);

    let { gasType } = await this.doQuestion([
      {
        name: 'gasType',
        message: 'Select GAS type',
        required: true,
      },
    ]);

    this.args.gasType = <string>gasType;
  }

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
   * Creates project directory structure.
   */
  private directoryStructure() {
    const projectName = this.args.name.replace(RegExp(' ', 'g'), '_');

    this.baseDir = joinPath(this.workDir, projectName);
    FileHandler.createDir(this.baseDir);

    this.appDir = joinPath(this.baseDir, 'app');
    FileHandler.createDir(this.appDir);

    this.prodDirTmp = joinPath(this.baseDir, `${projectName}_prod_tmp`);
    FileHandler.createDir(this.prodDirTmp);

    this.devDirTmp = joinPath(this.baseDir, `${projectName}_dev_tmp`);
    FileHandler.createDir(this.devDirTmp);

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
  private createGASprojects() {
    const claspFile = joinPath(this.baseDir, '.clasp.json');

    FileHandler.remove(claspFile);

    if (!fse.existsSync(this.prodDirTmp)) {
      throw new Error(`Directory ${this.prodDirTmp} not exists.`);
    }

    chdir(this.prodDirTmp);
    ClaspFacade.create({
      title: `${basenamePath(this.baseDir)}_prod`,
      type: this.args.gasType,
      parentId: this.args.parentIdProd,
      rootDir: '',
    });

    chdir(this.devDirTmp);
    ClaspFacade.create({
      title: `${basenamePath(this.baseDir)}_dev`,
      type: this.args.gasType,
      parentId: this.args.parentIdDev,
      rootDir: '',
    });

    FileHandler.copyFile(
      joinPath(this.devDirTmp, 'appsscript.json'),
      joinPath(this.appDir, 'appsscript.json')
    );

    FileHandler.copyFile(joinPath(this.devDirTmp, '.clasp.json'), claspFile);

    const claspData = FileHandler.readJSON(claspFile);
    claspData['rootDir'] = this.appDir;

    FileHandler.writeJSON(claspFile, claspData);
  }
}
