/**
 * Clasp facades.
 */

import { execSync } from 'child_process';

interface CreateParams {
  title: string /* Title for new project. */;
  type:
    | 'standalone'
    | 'docs'
    | 'sheets'
    | 'slides'
    | 'forms'
    | 'webapp'
    | 'api' /* Type of script. */;
  rootDir?: string /* Local directory */;
  parentId?: string /* A project parent Id */;
}

interface PushParams {
  force: boolean;
  watch: boolean;
}

/**
 * Create new project.
 */
export default class ClaspFacade {
  public static create(params: CreateParams) {
    let command = 'clasp create ';
    console.log(params);
    Object.entries(params).forEach((item: [string, string]) => {
      if (item[1]) command += `--${item[0]} ${item[1]} `;
    });

    execSync(command.trim(), { stdio: 'inherit' });
  }

  /**
   * Clone project.
   */
  public static clone() {}

  /**
   *
   */
  public static pull() {}

  public static push(params: PushParams) {
    let command = 'clasp push ';

    if (params.force) {
      command += '--force ';
    }

    if (params.watch) {
      command += '--watch';
    }

    execSync(command.trim(), { stdio: 'inherit' });
  }
}
