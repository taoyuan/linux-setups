#!/bin/bash

# Make sure this script is not run with sudo
if [ $(id -u) -eq 0 ]
then
  echo 'ERROR: This script should not be run as sudo or root.'
  exit
fi

# Update and upgrade
apt-get -yq update

# Install useful stuff
apt-get -yq install git-core zsh zip unzip expect locate ntp

# adds support for add-apt-repository
apt-get -yq install python-software-properties
add-apt-repository ppa:chris-lea/node.js

# Update and upgrade
apt-get -yq update

apt-get -yq install nodejs

updatedb
