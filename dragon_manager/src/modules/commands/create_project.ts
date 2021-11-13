/**
 * Workflow for start a new project.
 */

import FileHandler from '../files';
import Settings from '../../settings';

interface params {
  packages: string[];
}

export class CreateProject {
  private packages: string[] = [];

  constructor(params?: params) {
    if (params && 'packages' in params && params['packages'].length > 0) {
      this.packages = params['packages'];
    }

    this.instructionsPackage();
  }

  public static create(params?: params) {
    return new CreateProject(params);
  }

  public instructionsPackage() {
    const txt = `Select some package: ${Settings.dsModules.join(' ')}`;
    console.log(txt);
  }

  public getPackages() {}
}
