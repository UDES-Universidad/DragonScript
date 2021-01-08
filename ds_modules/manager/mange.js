#!/usr/bin/env node
const { StartProject } = require('./startproject');
const { ArgumentParser } = require('argparse');

const main = () => {
  const mainArg = process.argv[2];
  const parser = new ArgumentParser({
    prog: 'DragonScript',
    description: 'Dragon script manager.',
  });
  const args = [
    StartProject(parser),
  ];
  let noArgUsed = true;
  args.forEach((arg) => {
    if (arg.name === mainArg) {
      arg.exec();
      noArgUsed = false;
    }
  });
  if (noArgUsed) {
    console.group('Enter one of these arguments: ');
    args.forEach((arg) => console.log(arg.toString()));
    console.groupEnd();
  }
};

main();
