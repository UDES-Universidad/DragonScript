/**
 * Workflow for start a new project.
 */

import FileHandler from '../files';
import Settings from '../../settings';
import { ArgumentParser } from 'argparse';
import { exit, stdin, stdout } from 'process';
import { get as promptGet, start as promptStart } from 'prompt';

interface ArgsInter {
  type: string;
  modules: string[];
  name: string;
  parentIdProd: string;
  parentIdDev: string;
}

export class CreateProject {
  private args: ArgsInter = {
    type: '',
    modules: [],
    name: '',
    parentIdProd: '',
    parentIdDev: '',
  };

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
    argParse.add_argument('-m', '--modules', {
      help: 'Choose some DragonScript modules',
      type: 'str',
      action: 'append',
      choices: Settings.dsModules,
    });

    argParse.add_argument('-n', '--name', {
      help: 'Set project name',
      type: 'str',
      action: 'store',
    });

    argParse.add_argument('-p', '--parentId', {
      help: 'Parent ID',
      type: 'str',
      action: 'store',
    });

    this.args = argParse.parse_args();

    if (!this.args['name']) {
      this.args.name = '';
      await this.setProjectName();
    }

    if (!this.args['modules']) {
      this.args.modules = [];
      await this.setModules();
    }

    if (!this.args['parentIdProd']) {
      this.args.modules = [];
      await this.setParentId();
    }
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
    const instructions = `Select a project name:`;

    console.log(instructions);

    let { name } = await this.doQuestion([
      {
        name: 'name',
        message: 'Project name',
        required: true,
      },
    ]);

    this.args.name = <string>name;
  }

  private async setParentId() {
    const instructions = 'Enter parent file ID:';

    let { parentIdProd, parentIdDev } = await this.doQuestion([
      {
        name: 'parentIdProd',
        message: instructions,
      },
      {
        name: 'parentIdDev',
        message: 'Enter parent file ID for develop:',
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
          message: 'Module name',
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
}
