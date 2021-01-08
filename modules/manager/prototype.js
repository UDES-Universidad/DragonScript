const readline = require('readline');

class AbstractArg {
  name = null;

  help = null;

  argsv = null;

  argParser() {}

  process() {}

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
