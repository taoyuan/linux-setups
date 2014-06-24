"use strict";

var sh = require('shelljs');
var prop = require('properties-parser');

sh.exec('sudo apt-get -yq update', { silent: true });