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
  rootDir: string /* Local directory */;
  parentId: string /* A project parent Id */;
}

/**
 * Create new project.
 */
class ClaspFacade {
  public static create(params: CreateParams) {
    let command = 'clasp create';

    Object.entries(params).forEach((item: [string, string]) => {
      if (item[1]) command += `--${item[0]} ${item[1]}`;
    });

    execSync(command, { stdio: 'inherit' });
  }

  /**
   * Clone project.
   */
  public static clone() {}
}
