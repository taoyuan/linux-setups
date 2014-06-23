"use strict";

var sh = require('shelljs');
var prompt = require('prompt');
var nexpect = require('nexpect');
var fs = require('fs');
var prop = require('properties-parser');

//
// Start the prompt
//
prompt.start();
//
// Get two properties from the user: username and email
//
prompt.get({ properties: {
        username: {
            description: 'Username',
            default: 'deploy',
            required: true
        },
        password: {
            description: 'Shell Password',
            hidden: true,
            required: true
        },
        publicKey: {
            description: 'SSH Public Key',
            required: true
        },
        port: {
            description: 'SSH Port',
            default: 22,
            message: 'Port must be a number between 0 and 65535',
            conform: function (value) {
                return Number(value) > 0 && Number(value) < 65535;
            }
        }
    }},
    function (err, result) {
        execute(result);
    }
);

function execute(options) {
    sh.config.fatal = true;
    // add user
    sh.echo('Adding user');
    sh.exec('useradd -s /bin/bash -m ' + options.username);
    // add user to sudo group (append)
    sh.exec('usermod -a -G sudo ' + options.username);

    sh.echo('Applying password');
    // add user password
    nexpect.spawn("passwd " + options.username)
        .expect("Enter new UNIX password:")
        .sendline(options.password)
        .expect("Retype new UNIX password:")
        .sendline(options.password)
        .run(function (err) {
            if (err) throw err;
        });

    sh.echo('Grunting privilege');

    // grunt user advanced privilege
    var editor = prop.createEditor("/etc/sudoers", { separator: ' ' });
    editor.set(options.username, 'ALL=(ALL) NOPASSWD:ALL');
    editor.save();

    if (!fs.existsSync(pathSSH(options.username))) {
        sh.exec('mkdir ' + pathSSH(options.username));
    }

    sh.exec('touch ' + pathAuthorizedKeys(options.username));

    sh.echo(options.publicKey).toEnd(pathAuthorizedKeys(options.username));

    // backup original config file
    sh.cp('/etc/ssh/sshd_config /etc/ssh/sshd_config.bak');

    editor = prop.createEditor("/etc/ssh/sshd_config", { separator: ' ' });
    editor.set('Port', options.port);
    editor.set('RSAAuthentication', 'yes');
    editor.set('PubkeyAuthentication', 'yes');
    editor.set('PermitRootLogin', 'no');
    editor.set('PasswordAuthentication', 'yes');
    editor.save();

    // restart ssh
    sh.exec('service ssh restart');

    sh.exit(0);
}

function pathSSH(username) {
    return '/home/' + username + '/.ssh';
}

function pathAuthorizedKeys(username) {
    return '/home/' + username + '/.ssh/authorized_keys';
}