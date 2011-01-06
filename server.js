var express = require('express'),
app         = express.createServer(),
io          = require('socket.io');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(express.staticProvider(__dirname + '/frontend/'));
});
app.get('/', function (req, res) {
    res.redirect('/index.html');
});
app.listen(3000);

var gameObject = {};

var socket = io.listen(app); 
socket.on('connection', function(client) { 
    var gameEntry = gameObject[client.sessionId] = {};

    gameEntry.sessionId = client.sessionId;
    gameEntry.name     = "subzero";
    gameEntry.direction = "right";
    gameEntry.state    = "stance";
    gameEntry.hp       = 100;
    gameEntry.x        = 0;
    gameEntry.y        = 0;

    client.on('message', function(data) {
        //console.log("Action: " + data.action + " sessionId: " + client.sessionId);
        
        switch (data.action) {
            case 'walk':
                gameEntry.direction = data.direction;
                gameEntry.state = data.action;
                gameEntry.x     = data.x;
                gameEntry.y     = data.y;
                break;
            case 'stance':
                gameEntry.state = data.action;
                break;
            case 'punch':
            case 'kick':
                gameEntry.state = data.action;
                for (var sid in gameObject) {
                    if (gameObject.hasOwnProperty(sid)) {
                        var entry = gameObject[sid];

                        if (Math.abs(data.x - entry.x) < 70 && sid != client.sessionId) {
                            entry.state = "beinghit"; 
                            entry.hp -= 10;

                            setTimeout(function (entr) {
                                entr.state = "stance";         
                                client.broadcast({gameObject: gameObject}); 
                            }.bind(client, entry), 1000);
                        }
                    } 
                }
                break;
            case 'login':
               client.send({gameObject: gameObject, sessionId: client.sessionId}); 
               break;
        }
        client.broadcast({gameObject: gameObject}); 

    }); 

    client.on('disconnect', function(){
        delete gameObject[client.sessionId];
        client.broadcast({gameObject: gameObject, remove: client.sessionId}); 
        //console.log("Delete: " + client.sessionId);
    }); 
});
