app.controller.Game = function () {

    this._initArena();

    this._initSocket();

    this.__characterModelMap = {};
    this.__characterViewMap  = {};
    this.__characterControllerMap = {};
};

app.core.Object.extend(
    app.controller.Game,
    app.controller.Object
);

app.core.Object.mixin(app.controller.Game, {
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
    },

    _initSocket: function () {
        var that    = this; 
        var socket  = new io.Socket(); 
        this.__socket = socket;

        socket.on('connect', function (event) {
            console.log('connect');
        });

        socket.on('message', function(data){
            if (data.sessionId) {
                that.__sessionId = data.sessionId;
            }

            if (data.gameObject)  {
                that._update(data.gameObject); 
            }

            if (data.remove) {
                that._remove(data.remove); 
            }
        }); 

        socket.on('disconnect', function (event) {
            console.log('disconnect');
        });

        socket.connect();

        socket.send({action: "login"});
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
        var view       = new app.view.character.Subzero(model);
        var controller = new app.controller.Character(model, view);

        this._updateModel(model, data);

        this.__characterModelMap[data.sessionId]      = model;
        this.__characterViewMap[data.sessionId]       = view;
        this.__characterControllerMap[data.sessionId] = controller;

        if (data.sessionId == this.__sessionId) {
            this.__characterController = controller;
            this.__characterModel      = model;
        }
    }, 

    _remove: function (sessionId) {
        this.__characterViewMap[sessionId].remove();

        delete this.__characterModelMap[sessionId];
        delete this.__characterViewMap[sessionId];
        delete this.__characterControllerMap[sessionId];
    },

    _update: function (data) {
        var id;
        this.__gameObject = data;

        for (id in data) {
            var characterData = data[id]; 

            if (data.hasOwnProperty(id)) {
                if (this.__characterModelMap[id]) {
                    this._updateCharacter(characterData);
                }
                else {
                    this._createCharacter(characterData);
                }
            }
        }
    },

    _onKeyDown: function (event) {
        if (this.__characterController) {
            this.__characterController.dispatch(new app.event.Keyboard(event)); 
            this.__onChange(this.__characterModel.getData());
        }
    },

    _onKeyUp: function (event) {
        if (this.__characterController) {
            this.__characterController.dispatch(new app.event.Keyboard(event)); 
            this.__onChange(this.__characterModel.getData());
            
        }
    },

    _registerListener: function () {
       var window = this.getWindow(); 
       
       window.addEventListener("keydown", this._onKeyDown.bind(this), false);
       window.addEventListener("keyup",   this._onKeyUp.bind(this),   false);
    },

    run: function () {
        this._registerListener();
    }
});
