"use strict";

var sh = require('shelljs');
var prompt = require('prompt');
var nexpect = require('nexpect');
var fs = require('fs');

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
    sh.echo(options.username + ' ALL=(ALL) NOPASSWD:ALL').toEnd('/etc/sudoers');

    if (!fs.existsSync('/home/' + options.username + '/.ssh')) {
        sh.exec('mkdir /home/' + options.username + '/.ssh');
    }

    sh.exec('touch /home/' + options.username + '/.ssh/authorized_keys');

    sh.echo(options.publicKey).toEnd('/home/$USERNAME/.ssh/authorized_keys');

    // backup original config file
    sh.exec('cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak');

    sh.exec('sed -e "s/#\?Port .*/Port $PORT/g" -i /etc/ssh/sshd_config');

    sh.exec('sed -e "s/#\?RSAAuthentication .*/RSAAuthentication yes/g" -i /etc/ssh/sshd_config');

    sh.exec('sed -e "s/#\?PubkeyAuthentication .*/PubkeyAuthentication yes/g" -i /etc/ssh/sshd_config');

    sh.exec('sed -e "s/#\?PermitRootLogin .*/PermitRootLogin no/g" -i /etc/ssh/sshd_config');

    sh.exec('sed -e "s/#\?PasswordAuthentication .*/PasswordAuthentication no/g" -i /etc/ssh/sshd_config');

    // restart ssh
    sh.exec('service ssh restart');
}