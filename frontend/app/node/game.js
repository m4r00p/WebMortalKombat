app.core.Object.define("app.node.Game", {
    extend: app.core.Object,
    constructor: function (server, socket) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this.__server = server;
        this.__socket = socket;

        this.__user       = [];
        this.__gameObject = {};

        server.post('/login', this._onServerLogin.bind(this));

        this._init();
    },
    statics: {},
    members: {
        __socket: null,
        __server: null,

        __user: null,

        __gameObject: null,

        _init: function () {
            var socket = this.__socket;    

            socket.on('connection', this._onConnection.bind(this));
        },

        _onServerLogin: function (req, res) {
            var user     = this.__user;
            var username = req.body.username;

            res.header('Content-Type', 'application/json');
            if (-1 === user.indexOf(username)) {
                user.push(username);
                res.send({result: true});
            } else {
                res.send({result: false});
            }
        },

        _onConnection: function (client) {
            client.on('message', this._onClientMessage.bind(this, client)); 
            client.on('disconnect', this._onClientDisconnect.bind(this, client));

            var gameObject = this.__gameObject;
            var gameEntry  = gameObject[client.sessionId] = {};

            gameEntry.sessionId = client.sessionId;
            gameEntry.name      = "subzero";
            gameEntry.direction = "right";
            gameEntry.state    = "stance";
            gameEntry.hp       = 100;
            gameEntry.x        = 10 + Math.random() * 1000;
            gameEntry.y        = 0;

            client.send({gameObject: gameObject, sessionId: client.sessionId});
            client.broadcast({add: gameEntry});
        },

        _onClientMessage: function (client, data) {
          var gameObject = this.__gameObject;
          var gameEntry  = gameObject[client.sessionId];

          switch (data.action) {
            case 'walk':
              gameEntry.direction = data.direction;
              gameEntry.state     = data.action;
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
                      client.broadcast({change: entr});
                      client.send({change: entr});
                    }.bind(client, entry), 1000);

                      client.broadcast({change: entry});
                      client.send({change: entry});
                  }
                }
              }
              break;
          }
          client.broadcast({change: gameEntry});
        },

        _onClientDisconnect: function (client) {
            var gameObject = this.__gameObject;
            delete gameObject[client.sessionId];
            client.broadcast({remove: client.sessionId});
        }
    }
});

