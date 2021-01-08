const {dirname} = require('path');
const path = require('path');
const readline = require('readline');

class AbstractArg {
  baseDir = path.dirname(path.dirname(__dirname));

  configFile = 'dragonScript.json';

  dsModules = ['gss', 'gdocs', 'gslides', 'gmail', 'gform', 'webapp'];

  parser = null;

  name = null;

  help = null;

  argsv = null;

  argParser() {}

  process() {}

  constructor(parser) {
    this.parser = parser;
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
    this.process();
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

exports.ArgAbs = AbstractArg;
