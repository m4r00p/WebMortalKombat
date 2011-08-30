app.core.Object.define("app.controller.Game", {
    extend: app.controller.Object,
    constructor: function (model, view) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor


        this.__gameObject = {};
        this._initArena();
        this._initSocket();

        this.__characterModelMap = {};
        this.__characterViewMap  = {};
        this.__characterControllerMap = {};
    },
    statics: {},
    members: {
        __arena: null,

        __characterController: null,
        __characterModel: null,

        __characterModelMap: null,
        __characterViewMap: null,
        __characterControllerMap: null,

        __sessionId: null,
        __gameObject: null,

        __socket: null,

        __onChange: function (data) {
            data.action = data.state;
            this.__socket.send(data);
//            console.log("send !");
//            console.log(data);
        },

        _initSocket: function () {
            var that      = this;
            var socket    = new io.Socket();
            this.__socket = socket;

            socket.on('connect', function (event) {
                console.log('connect');
            });

            var counter = 0;
            socket.on('message', function(data){
                ++counter;
                if (data.sessionId) {
                    that.__sessionId = data.sessionId;
                }

                if (data.gameObject)  {
                    that._initGameObject(data.gameObject);
                }

                if (data.remove) {
                    that._remove(data.remove);
                }

                if (data.change) {
                    that._updateCharacter(data.change);
                }

                if (data.add) {
                    that._createCharacter(data.add);
                }
            });

            setInterval(function () {
               console.log("counter: " + counter);
                counter = 0;
            }, 1000);

            socket.on('disconnect', function () {
                console.log('disconnect');
            });

            socket.connect();

        },

        _initArena: function () {
            var arenaModel      = new app.model.Arena();
            var arenaView       = new app.view.Arena(arenaModel);
            var arenaController = new app.controller.Arena(
                arenaModel,
                arenaView
            );

            this.__arena = arenaController;
        },

        _updateModel: function (model, data) {
            var property, method;

            for (property in data) {
                if (data.hasOwnProperty(property)) {
                    method = "set" + property.ucfirst();

                    if (model[method]) {
                        model[method](data[property]);
                    }
                    else {
                        console.warn("There is not such setter on model!!!");
                    }
                }
            }
        },

        _updateCharacter: function (data) {
            var model = this.__characterModelMap[data.sessionId];
            this._updateModel(model, data);
        },

        _createCharacter: function (data) {
            var model      = new app.model.Character();
            var view       = new app.view.Character(model);
            var controller = new app.controller.Character(model, view);

            this._updateModel(model, data);


            this.__characterViewMap[data.sessionId]       = view;
            this.__characterModelMap[data.sessionId]      = model;
            this.__characterControllerMap[data.sessionId] = controller;

            if (data.sessionId == this.__sessionId) {
                this.__characterController = controller;
                model.addListener('change', this.__onChange.bind(this));
                var iter = 0, sign = 1;
                setInterval(function () {
                    if (document.getElementById("bot").value) {
                        iter++;
                        if (iter > 100) {

                            model.setState("walk");
                            model.setDirection(model.getDirection() === "right" ? "left" : "right");
                            iter = 0;
                            sign *= -1;
                        }
                        model.setX(model.getX() + sign * 5);
                        model.setState("walk");

                        this.__socket.send(model.getData());
                    }
                }.bind(this),50);
            }
        }, 

        _remove: function (sessionId) {
            console.log("to remove " + sessionId);
            console.log(this.__characterViewMap);
            this.__characterViewMap[sessionId].remove();

            delete this.__characterModelMap[sessionId];
            delete this.__characterViewMap[sessionId];
            delete this.__characterControllerMap[sessionId];
        },

        _initGameObject: function (data) {
            var id;

            for (id in data) {
                if (data.hasOwnProperty(id)) {
                    this._createCharacter(data[id]);
                }
            }
        },

        _onKeyboardPress: function (queue) {
            if (this.__characterController) {
                this.__characterController.dispatch(queue); 
            }
        },

        _registerListener: function () {
           this._keyboard = new app.event.Keyboard();
           this._keyboard.addListener("press", this._onKeyboardPress.bind(this));
        },

        _stopPropagation: function (event) {
           event.stopPropagation();
        },

        _onClickLogin: function () {
            var input = this.getDocument().getElementById("username");

            if (input.value) {
                $.ajax({
                  type: 'POST',
                  url: '/login',
                  data: {username: input.value},
                  success: this._onLoginSucced,
                  dataType: 'application/json' 
                });
            }
        },

        _onLoginSucced: function (data) {
           console.log('data', data) 
        },

        _input: null,

        run: function () {
//            var input = this.getDocument().getElementById("username");
//            var login = this.getDocument().getElementById("login");
//
//            this._input = input;
//
//            input.addEventListener("keydown", this._stopPropagation, false);
//            input.addEventListener("keyup", this._stopPropagation, false);
//
//            login.addEventListener("click", this._onClickLogin.bind(this), false);

            this._registerListener();
        }
    }
});
