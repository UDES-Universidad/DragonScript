const fs = require('fs-extra');
const path = require('path');
const { ArgAbs } = require('./prototype');

class StartProjectProto extends ArgAbs {
  baseDir = null;

  name = 'startproject';

  help = 'creates a new GAS project.';

  projectData = {
    projectName: null,
    gasId: null,
    gasIdDev: null,
    dragonModules: [],
  };

  configFile = 'dragonScript.json';

  dsModules = ['gss', 'gdocs', 'gslides', 'gmail', 'gform', 'webapp'];

  constructor(parser) {
    super();
    this.baseDir = __dirname;
    this.parser = parser;
  }

  argParser() {
    const dirModules = path.dirname(this.baseDir);
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
      `Enter modules splited by comma (,). Modules allowed: ${this.dsModules.join(',')}: `,
    );
    dsModules = typeof dsModules === 'string'
      ? dsModules.split(',')
      : dsModules;
    const id = await this.valArsOrPrompt('id');
    const configFile = path.join(projectPath, this.configFile);
    const dsModulesNewProject = path.join(projectPath, 'ds_modules');
    const dirModules = path.dirname(this.baseDir);
    if (projectName && projectPath && id) {
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
        configData.projectName = projectName;
        configData.projectPath = projectPath;
        configData.gasId = id;
        fs.writeFileSync(configFile, JSON.stringify(configData));
        fs.mkdirSync(dsModulesNewProject);
        if (dsModules && dsModules.length > 0) {
          dsModules.forEach((moduleName) => {
            const module = path.join(dirModules, moduleName);
            if (moduleName && fs.existsSync(module)) {
              console.log(module);
              fs.copySync(
                module,
                path.join(dsModulesNewProject, moduleName),
              );
            }
          });
        }
      }
    }
  }
}

exports.StartProject = (parser) => new StartProjectProto(parser);
