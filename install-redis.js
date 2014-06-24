"use strict";

var sh = require('shelljs');
var prop = require('properties-parser');

var opts = { silent: false },
    cmds;

if (sh.which('redis-server')) {
    var version = sh.exec('redis-server', {silent: true}).output;
    sh.echo('redis v', version, 'has been installed, exit now');
    sh.exit(1);
}

// Install redis-server
cmds = [
    'sudo apt-get -yq update',
    'sudo apt-get -yq install python-software-properties',
    'sudo add-apt-repository -y ppa:rwky/redis',
    'sudo apt-get -yq update',
    'sudo apt-get -yq install redis-server'
];

commands.forEach(function (cmd) {
    sh.exec(cmd, opts);
});

// Config redis
