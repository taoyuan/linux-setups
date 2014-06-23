#!/bin/bash

# Make sure this script is not run with sudo
if [ $(id -u) -eq 0 ]
then
  echo 'ERROR: This script should not be run as sudo or root.'
  exit
fi

# Update and upgrade
sudo apt-get -yq update

# Install useful stuff
sudo apt-get -yq install git-core zsh zip unzip expect locate ntp

# adds support for add-apt-repository
sudo apt-get -yq install python-software-properties
sudo add-apt-repository ppa:chris-lea/node.js

# Update and upgrade
sudo apt-get -yq update

sudo apt-get -yq install nodejs

sudo updatedb

# Install oh-my-zsh
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
