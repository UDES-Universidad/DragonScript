const { execSync } = require("child_process");
const fs = require('fs-extra');
const path = require('path');
const { ArgAbs } = require('./prototype');

class StartProjectProto extends ArgAbs {
  name = 'startproject';

  help = 'creates a new GAS project.';

  projectData = {
    projectName: null,
    gasId: null,
    gasIdDev: null,
    ds_modules: [],
  };

  filesToCopy = [
    'Settings.ts',
    '.eslintrc.js',
    'tsconfig.json',
  ];

  commands = [
    'npm init -y',
    'npm install -g @google/clasp',
    'npm install -g typescript',
    'npm i -S @types/google-apps-script',
    'npm install eslint eslint-config-airbnb-typescript eslint-plugin-import@^2.22.0 @typescript-eslint/eslint-plugin@^4.4.1 --save-dev',
  ];

  constructor(parser) {
    super(parser);
  }

  argParser() {
    this.parser.add_argument(this.name, { help: this.help });
    this.parser.add_argument('-n', '--project-name', {
      action: 'store',
      help: 'set a project name.',
    });
    this.parser.add_argument('-p', '--project-path', {
      action: 'store',
      help: 'set a path and name project.',
    });
    this.parser.add_argument('-id', '--gas-id', {
      action: 'store',
      help: 'set GAS project id.',
    });
    this.parser.add_argument('-idd', '--gas-id-dev', {
      action: 'store',
      help: 'set GAS project id for dev.',
    });
    this.parser.add_argument('-am', '--add-module', {
      action: 'append',
      choices: this.dsModules,
      help: 'add module',
    });
    this.argsv = this.parser.parse_args();
  }

  async process() {
    let configData = this.projectData;
    const projectName = await this.valArsOrPrompt(
      'project_name',
      'Enter a project name: ',
    );
    const projectPath = await this.valArsOrPrompt(
      'project_path',
      'Enter directory path: ',
    );
    let dsModules = await this.valArsOrPrompt(
      'add_module',
      `Enter modules splited by comma (,).\nDS modules allowed: ${this.dsModules.join(', ')}.\nModules: `,
    );
    dsModules = typeof dsModules === 'string'
      ? dsModules.split(',')
      : dsModules;
    const gasId = await this.valArsOrPrompt('gas_id');
    const gasIdDev = await this.valArsOrPrompt('gas_id_dev');
    // Configuration file in the new project.
    const configFile = path.join(projectPath, this.configFile);
    // ds_modules in the new project.
    const dsModulesNewProject = path.join(projectPath, 'ds_modules');
    // ds_modules in Dragon Script App.
    const dirModules = path.join(this.baseDir, 'ds_modules');
    if (projectName && projectPath && gasId) {
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
        configData.projectName = projectName;
        configData.projectPath = projectPath;
        configData.gasId = gasId;
        configData.gasIdDev = gasIdDev;
        configData.ds_modules = dsModules;
        fs.writeFileSync(configFile, JSON.stringify(configData));
        fs.mkdirSync(dsModulesNewProject);
        if (dsModules && dsModules.length > 0) {
          dsModules.forEach((moduleName) => {
            const module = path.join(dirModules, moduleName.trim());
            if (moduleName && fs.existsSync(module)) {
              fs.copySync(
                module,
                path.join(dsModulesNewProject, moduleName),
              );
            }
          });
        }
        this.filesToCopy.forEach((f) => fs.copySync(
          path.join(this.baseDir, f),
          path.join(projectPath, f),
        ));
        process.chdir(projectPath);
        this.commands.forEach((c) => execSync(c));
        if (gasId || gasIdDev) execSync(`clasp clone ${gasId || gasIdDev}`);
      } else {
        console.log('Project directory alreday exists.');
      }
    }
  }
}

exports.StartProject = (parser) => new StartProjectProto(parser);
