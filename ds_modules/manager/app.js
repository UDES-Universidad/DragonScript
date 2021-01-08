const fs = require('fs-extra');
const path = require('path');
const { ArgAbs } = require('./prototype');

class AppProto extends ArgAbs {
  name = 'app';

  help = 'manages an application.';

  configFile = 'dragonScript.json';

  constructor(parser) {
    super();
  }
}
