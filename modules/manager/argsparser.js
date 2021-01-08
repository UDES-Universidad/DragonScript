#!/usr/bin/env node
/*
 * This module parse arguments.
 * */

const { ArgumentParser } = require('argparse');

/*
 * Search an argument in an array with the next structure:
 * ['argument', {help: 'description'}]
 * */
const argFilter = (arg, argList) => {
  try {
    return argList.filter((i) => i[0] === arg)[0];
  } catch (error) {
    throw new Error(`${arg} argument not exists.`);
  }
};

/**
  * Show in console an array of arguments.
  * */
const showmainArgs = (mainArgs, message = '') => {
  console.group(message);
  mainArgs.forEach((argOp) => {
    console.log(`- ${argOp[0]}: ${argOp[1].help}`);
  });
  console.groupEnd();
};

/*
 * Get command line arguments.
 * */
const ArgParser = (mainArgs) => {
  const argv = process.argv;
  const arg = argFilter(argv[2], mainArgs);
  if (argv.length > 2 && arg && arg[0] === 'startproject') {
    const parser = new ArgumentParser({
      description: 'DragonScript manager.',
      prog: 'DragonScript',
    });
    parser.add_argument(...arg);
    parser.add_argument('-n', '--name', {
      action: 'store',
      help: 'set a path and name project.',
    });
    parser.add_argument('-id', '--gas-id', {
      action: 'store',
      help: 'set GAS project id.',
    });
    // parser.add_argument('');
    return parser.parse_args();
  }
  showmainArgs(mainArgs, 'Enter one of these arguments:');
};

exports.ArgParser = ArgParser;
