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
}

export class CreateProject {
  private args: ArgsInter;

  constructor(argParse: ArgumentParser) {
    argParse.add_argument('-m', '--modules', {
      help: 'Choose some DragonScript modules',
      type: 'str',
      action: 'append',
      choices: Settings.dsModules,
    });

    this.args = argParse.parse_args();

    if (!this.args['modules']) {
      this.args.modules = [];
      this.instructionsModule();
      this.getModules();
    }
  }

  /**
   *
   * @param argParse {ArgumentParser}
   * @returns CreateProject instance.
   */
  public static create(argParse: ArgumentParser) {
    return new CreateProject(argParse);
  }

  /**
   * Show module instructions.
   */
  public instructionsModule() {
    const txt = `Select some module:\n${Settings.dsModules
      .sort()
      .map((v, i) => `  ${i}. ${v}`)
      .join('\n')}`;
    console.log(`${txt}\n  q: omit / quit \n  s: show modules`);
  }

  /**
   *
   * @param question {string}: Question to show.
   */
  public async doQuestion(question: { [keys: string]: any }[]) {
    promptStart();
    const _question = await promptGet(question);
    return _question;
  }

  /** Check if DS Module exists. */
  public moduleExists(pkg: string) {
    return Settings.dsModules.includes(pkg);
  }

  /**
   * This function is executed if there is no DS module
   */
  public async getModules() {
    while (true) {
      let { pkg } = await this.doQuestion([
        {
          name: 'pkg',
          message: 'Module name',
        },
      ]);

      if (pkg === 'q') break;

      if (pkg === 's') {
        this.instructionsModule();
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
