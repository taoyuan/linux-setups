#!/bin/bash

# Update and upgrade
sudo apt-get -yq update

# Install useful stuff
sudo apt-get -yq install git-core zsh zip unzip expect locate ntp
sudo apt-get -yq install gcc g++ gcc-c++ make

# Note the new setup script name for Node.js v0.12
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -

# Then install with:
sudo apt-get install -y nodejs

sudo updatedb

# Install useful npm stuff
sudo npm install -g shelljs

# Install oh-my-zsh
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sudo sh

sudo git clone https://github.com/taoyuan/linux-setups

cd linux-setups

npm install
