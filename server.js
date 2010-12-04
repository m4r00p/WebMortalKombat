var express = require('express'),
app         = express.createServer(),
GameServer  = require('./backedn/src/game_server.js').GameServer,
gameServer  = new GameServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(express.staticProvider(__dirname + '/frontend/source/'));
});

gameServer.init();

app.get('/login', function (req, res) {
    res.send(gameServer.dispatch(req));
});

app.listen(3000);
