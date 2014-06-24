#! /usr/bin/env node

"use strict";

var sh = require('shelljs');
var argv = require('minimist')(process.argv.slice(2));

var hostname = sh.exec('hostname', { silent: true }).output;
if (argv._.length < 1) {
    sh.echo('Expect new name!', hostname);
    sh.exit(1);
}
var newname = argv._[0];

sh.echo('Change Hostname: ', hostname, '->', newname);
sh.exec('hostname', newname);
sh.sed('-i', hostname, newname, '/etc/hosts');