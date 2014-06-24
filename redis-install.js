"use strict";

var sh = require('shelljs');
var prompt = require('prompt');
var prop = require('properties-parser');

var opts = { silent: false },
    cmds, ver;

if (sh.which('redis-server')) {
    ver = sh.exec('redis-server -v', {silent: true}).output;
    sh.echo('Redis', ver, 'has been installed.');
}

if (ver) {
    prompt.start();
    prompt.get({ properties: {
            continue: {
                description: 'Continue to Install? [Y/n]'.yellow,
                default: 'n',
                required: true
            }
        }},
        function (err, result) {
            if (result.continue == 'y' || result.continue == 'Y') {
                install(opts);
            }
        }
    );
} else {
    install(opts);
}

if (ver) {
    prompt.start();
    prompt.get({ properties: {
            continue: {
                description: 'Continue to Setup? [Y/n]'.yellow,
                default: 'n',
                required: true
            }
        }},
        function (err, result) {
            if (result.continue == 'y' || result.continue == 'Y') {
                setup(opts);
            }
        }
    );
} else {
    setup(opts);
}

// install redis
function install(opts) {
    sh.echo('Install redis');
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
    sh.echo('Setup redis');
    var editor = prop.createEditor('/etc/redis/conf.d/local.conf', { separator: ' ' });
    editor.set('bind', '127.0.0.1');
    editor.save();
    sh.exec('sudo service redis-server restart');
}