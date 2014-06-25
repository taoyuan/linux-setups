#! /usr/bin/env node

"use strict";

var sh = require('shelljs');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var hostname = sh.exec('hostname', { silent: true }).output;
hostname = hostname.replace('\n', '');
if (argv._.length < 1) {
    sh.echo('Expect a new name!');
    sh.exit(1);
}
var newname = argv._[0];

sh.echo('Change Hostname: ' + hostname + ' -> ' + newname);
fs.writeFileSync('/etc/hostname', newname);
sh.exec('sudo hostname ' + newname);
sh.sed('-i', hostname, newname, '/etc/hosts');