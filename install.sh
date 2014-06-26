#!/bin/bash

# Update and upgrade
sudo apt-get -yq update

# Install useful stuff
sudo apt-get -yq install git-core zsh zip unzip expect locate ntp
sudo apt-get -yq install gcc g++ gcc-c++ make

# adds support for add-apt-repository
sudo apt-get -yq install python-software-properties
sudo add-apt-repository -y ppa:chris-lea/node.js

# Update and upgrade
sudo apt-get -yq update

sudo apt-get -yq install nodejs

sudo updatedb

# Install useful npm stuff
sudo npm install -g shelljs

# Install oh-my-zsh
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sudo sh

sudo git clone https://github.com/taoyuan/linux-setups

cd linux-setups

npm install
