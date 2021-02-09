const path = require('path');
const readline = require('readline');
const Settings = require('../../DragonScriptConfig');

class AbstractArgument {
  configFile = Settings.configFile;

  dsModules = Settings.dsModules;

  dsModulesName = Settings.dsModulesName;

  baseDir = null;

  currentExecDir = null;

  parser = null;

  name = null;

  help = null;

  argsv = null;

  /**
    * Get parse arguments from command line.
    * */
  argParser() {}

  /**
   * Execute all work with the arguments.
    * */
  processor() {}

  constructor(parser) {
    this.parser = parser;
    this.baseDir = this._baseDir();
    this.currentExecDir = this._currentExecDir();
  }

  /**
    * Get a base directory where the core script is hosted.
    * */
  _baseDir() {
    return path.dirname(path.dirname(__dirname));
  }

  /**
   * Get directory where the script is executing.
    * */
  _currentExecDir() {
    return process.cwd();
  }

  /**
    * Return a command info.
    * */
  toString() {
    return `- ${this.name}: ${this.help}`;
  }

  /**
    * Executes de process.
    * */
  exec() {
    this.argParser();
    this.processor();
  }

  /**
    * Get data from terminal.
    * This is a promise.
    * */
  prompt(query) {
    return new Promise((resolve) => {
      const wonder = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
      });
      wonder.question(query, (resp) => {
        resolve(resp);
        wonder.close();
      });
    });
  }

  /**
    * Get value from args or prompt.
    * */
  valArsOrPrompt(argName, message) {
    const arg = this.argsv[argName]
      ? this.argsv[argName]
      : this.prompt(message || `Enter ${argName}: `);
    return arg;
  }
}

module.exports = AbstractArgument;
