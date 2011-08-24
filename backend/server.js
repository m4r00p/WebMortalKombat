var express = require('express'),
server      = express.createServer(),
io          = require('socket.io');

require('./app/core/object.js');
require('./app/node/game.js');

//init static providers
server.configure(function(){
    server.use(express.methodOverride());
    server.use(express.bodyParser());
    server.use(express.static(__dirname + '/../frontend/'));
});


//redirect root
server.get('/', function (req, res) {
    res.redirect('/index.html');
});

//init http server
//process.env['app_port'] should be set by nodester
server.listen(process.env['app_port'] || 3000);

new app.node.Game(server, io.listen(server));
