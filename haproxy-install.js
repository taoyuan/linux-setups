"use strict";

var sh = require('shelljs');

sh.exec('sudo add-apt-repository -y ppa:vbernat/haproxy-1.5');
sh.exec('sudo apt-get -yq update');
sh.exec('sudo apt-get -yq install haproxy');
