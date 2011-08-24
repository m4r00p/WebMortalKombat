app.core.Object.define("app.model.Player", {
    extend: app.model.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

    },
    statics: {},
    members: {
        setData: function (data) {
            this._username  = data.username;
            this._sessionId = data.sessionId;
        },

        getData: function () {
            return  {
                username: this.
            };
        },

        __onChange: function (asdf, qwer) {
            this.fireDataEvent("change", this.getData()); 
        },

        _username:  null,
        _sessionId: null,

        setName: function (newValue) {
            var oldValue = this._name;

            if (oldValue !== newValue) {
                this._name = newValue;
                this.fireDataEvent("changeX", [newValue, oldValue]); 
            }   
        },

        getName: function () {
            return this._name;
        },

        setX: function (newValue) {
            var oldValue = this._x;

            if (oldValue !== newValue) {
                this._x = newValue;
                this.fireDataEvent("changeX", [newValue, oldValue]); 
            }   
        },

        getX: function () {
            return this._x;
        },

        setY: function (newValue) {
            var oldValue = this._y;

            if (oldValue !== newValue) {
                this._y = newValue;
                this.fireDataEvent("changeY", [newValue, oldValue]); 
            }   
        },

        getY: function () {
            return this._y;
        },

        setHp: function (newValue) {
            var oldValue = this._hp;

            if (oldValue !== newValue) {
                this._hp = newValue;
                this.fireDataEvent("changeHp", [newValue, oldValue]); 
            }   
        },

        getHp: function () {
            return this._hp;
        },

        setSessionId: function (newValue) {
            var oldValue = this._sessionId;

            if (oldValue !== newValue) {
                this._sessionId = newValue;
                this.fireDataEvent("changeSessionId", [newValue, oldValue]); 
            }   
        },

        getSessionId: function () {
            return this._sessionId;
        },

        setState: function (newValue) {
            var oldValue = this._state;
            if (this._stateList.indexOf(newValue) === -1) {
                throw new Error("There is no such state on _stateList: [" + newValue + "] !!!")        
            }
            if (oldValue !== newValue) {
                this._state     = newValue;
                this._prevState = oldValue;
                this.fireDataEvent("changeState", [newValue, oldValue]); 
            }   
        },

        getState: function () {
            return this._state;
        },

        setDirection: function (newValue) {
            var oldValue = this._direction;

            if (oldValue !== newValue) {
                this._direction = newValue;
                this.fireDataEvent("changeDirection", [newValue, oldValue]); 
            }   
        },

        getDirection: function () {
            return this._direction;
        },

        getName: function () {
            return this._name;
        },

        getFileName: function () {
            return  this._name + "-" + this._state;
        },
        
        getPrevFileName: function () {
            return  this._name + "-" + this._prevState;
        }
    }
});
