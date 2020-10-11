#!/usr/bin/env node

const parseArgs = require('minimist');

const executeHashCommand = require('./hash');
const executeCheckCommand = require('./check');

const argv = parseArgs(process.argv.slice(2));

const command = argv._[0];

switch (command) {
    case 'hash':
        executeHashCommand(argv);
        break;
    case 'check':
        executeCheckCommand(argv);
        break;
    default:
        console.log(`Unknown command "${command}".`);
}