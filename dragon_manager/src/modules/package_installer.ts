import { exec, execSync } from 'child_process';
import { stdin, stdout } from 'process';
import Settings from '../settings';

export default class PackageInstaller {
  private npm = 'npm i';

  public static install() {
    const installer = new PackageInstaller();
    installer.execCommands();
  }

  private commandBuilder(commandType: string, packages: string[]): string {
    let _commandType = '-D';
    if (commandType === 'prod') _commandType = '-S';
    return [this.npm, _commandType, ...packages].join(' ').trim();
  }

  private execCommands() {
    let commands = [
      this.commandBuilder('dev', [...Settings.nodePackages_dev]),
      this.commandBuilder('prod', [...Settings.nodePackages_prod]),
    ];

    for (const command of commands) {
      const stdout = execSync(command, { stdio: 'inherit' });
    }
  }
}
