var express = require('express'),
app         = express.createServer(),
io          = require('socket.io');

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(express.staticProvider(__dirname + '/frontend/'));
});
app.get('/', function (req, res) {
    res.redirect('/index-dummy.html');
});
app.listen(3000);

var socket = io.listen(app); 
socket.on('connection', function(client) { 
    client.on('message', function(data) {
        this.send(null);
    }); 

    client.on('disconnect', function(){}); 
});


