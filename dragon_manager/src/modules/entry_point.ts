import { ArgumentParser } from 'argparse';
import { argv, cwd } from 'process';
import { CreateProject } from './commands/create_project';

export class DragonStarter {
  private currentDir: string;

  private argParse: ArgumentParser;

  constructor() {
    this.currentDir = cwd();

    this.argParse = new ArgumentParser({
      description: 'DragonScript, GAS supercharged 🔥️!!!',
    });

    const mainCommand = argv[2];

    this.argParse.add_argument('type', {
      help: 'Execute GAS action.',
      type: 'str',
      choices: ['create', 'pull', 'push'],
    });

    let notArgument = true;

    if (mainCommand === 'create') {
      this.create();
      notArgument = false;
    } else if (mainCommand === 'pull') {
      this.pull();
      notArgument = false;
    } else if (mainCommand === 'push') {
      this.push();
      notArgument = false;
    }

    if (notArgument) this.argParse.parse_args();
  }

  public static start(): DragonStarter {
    return new DragonStarter();
  }

  private create() {
    this.argParse.add_argument('-m', '--modules', {
      help: 'Choose some DragonScript modules',
      type: 'str',
    });

    const args = this.argParse.parse_args();

    CreateProject.create(args);
  }

  private pull() {}

  private push() {}
}
