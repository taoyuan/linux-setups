"use strict";

var sh = require('shelljs');
var prop = require('properties-parser');

var opts = { silent: false },
    cmds, ver;

if (sh.which('redis-server')) {
    ver = sh.exec('redis-server', {silent: true}).output;
    sh.echo('Redis', ver, 'has been installed.');
}

if (ver) {
    prompt.start();
    prompt.get({ properties: {
            continue: {
                description: 'Continue to Reinstall? [Y/n]'.yellow,
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
// see: http://blog.sensible.io/2013/08/20/setting-up-redis-for-production-environment.html
function setup(opts) {
    sh.echo('Setup redis');
    return;
    var editor = prop.createEditor('/etc/redis/redis.conf', { separator: ' ' });
    //  dump the dataset every 15 minutes (900 seconds) if at least one key changed,
    editor.set('save', '900 1');
    editor.set('appendonly', 'yes');
    editor.set('appendfsync', 'everysec');

    editor.set('daemonize', 'yes');
    editor.set('bind', '127.0.0.1');

    editor.save();
}
