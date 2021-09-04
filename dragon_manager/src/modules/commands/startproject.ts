/**
 * Workflow for start a new project.
 */

import FileHandler from '../files';
import Settings from '../../settings';

const p = [];

interface Params {
  dest: string;
  packages: string[];
}

class StartProject {
  private _destDir = '';

  constructor(params: Params) {}

  public static start(params: Params) {
    return new StartProject(params);
  }
}
