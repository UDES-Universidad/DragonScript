import ClaspFacade from '../clasp_facades';
import { ArgumentParser } from 'argparse';
import FileHandler from '../files';
import { cwd } from 'process';
import { join as joinPath } from 'path';

interface argsInter {
  force: boolean;
  watch: boolean;
  prod: boolean;
  dev: boolean;
}

/**
 *
 */
export default class PushProject {
  private args: argsInter = {
    force: false,
    watch: false,
    prod: false,
    dev: false,
  };

  private currentDir: string = '';

  constructor(argParse: ArgumentParser) {
    this.currentDir = cwd();
    this.run(argParse);
  }

  public static create(argParse: ArgumentParser) {
    return new PushProject(argParse);
  }

  /**
   *
   * @param argParse
   */
  private async run(argParse: ArgumentParser) {
    argParse.add_argument('-f', '--force', {
      action: 'store_true',
      help: 'Forcibly overwrites the remote manifest.',
    });

    argParse.add_argument('-w', '--watch', {
      action: 'store_true',
      help: 'Watches local file changes. Pushes files every few seconds.',
    });

    argParse.add_argument('-p', '--prod', {
      action: 'store_true',
      help: 'CAUTION: Push code to production.',
    });

    argParse.add_argument('-d', '--dev', {
      action: 'store_true',
      default: true,
      help: 'Push code to develop',
    });

    const args = argParse.parse_args();

    this.args.force = args.force;
    this.args.watch = args.watch;
    this.args.prod = args.prod;
    this.args.dev = args.dev;

    await this.selectMode();
    await this.execCommand();
  }

  /**
   *
   */
  private async execCommand() {
    ClaspFacade.push(this.args);
  }

  /**
   *
   * @returns
   */
  private async selectMode() {
    const dragonScriptConf = joinPath(
      this.currentDir,
      'dragonscript.config.json'
    );

    const dsValues = FileHandler.readJSON(dragonScriptConf);

    const claspFile = joinPath(this.currentDir, '.clasp.json');

    if (this.args.prod) {
      FileHandler.writeJSON(claspFile, dsValues.prod);
      return;
    } else if (this.args.dev && !this.args.prod) {
      FileHandler.writeJSON(claspFile, dsValues.dev);
      return;
    } else if (this.args.dev && this.args.prod) {
      console.log('ERROR: Choose "prod" or "dev".');
      return;
    }
  }
}
