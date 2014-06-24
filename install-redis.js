"use strict";

var sh = require('shelljs');
var prop = require('properties-parser');

var opts = { silent: false },
    cmds;

if (sh.which('redis-server')) {
    var version = sh.exec('redis-server', {silent: true}).output;
    sh.echo('Redis', version, 'has been installed.');
}

install(opts);
setup(opts);

// install redis
function install(opts) {
    cmds = [
        'sudo apt-get -yq update',
        'sudo apt-get -yq install python-software-properties',
        'sudo add-apt-repository -y ppa:rwky/redis',
        'sudo apt-get -yq update',
        'sudo apt-get -yq install redis-server'
    ];

    cmds.forEach(function (cmd) {
        sh.exec(cmd, opts);
    });
}

// setup redis
function setup(opts) {

}
