app.core.Object.define("app.event.Keyboard", {
    extend: app.event.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
       
        this._queue = [];

        this._init();
    },
    statics: {},
    members: {
        _interval: null,
        _queue: null,
        _last: null,

        _init: function () {
           var window = this.getWindow(); 
           window.addEventListener("keydown", this._onKeyDown.bind(this), false);

           this._interval = setInterval(this._loop.bind(this), 50);
        },

        _onKeyDown: function (event) {
            this._push(this._map(event));
            event.stopPropagation();
            event.preventDefault();
        },

        _loop: function () {
            var queue  = this._queue;
            var time   = +new Date();
            var last   = queue[queue.length - 1];

            if (last && last[2] && (time - last[2] < 500)) {
                if (last != this._last) {
                    this._last = last;
                    this.fireDataEvent("press", this._queue);
                }
            }
            else {
                this._queue = [];
            }

        },

        _push: function (item) {
            var queue  = this._queue;

            queue.push(item);

            if (queue.length > 10) {
                queue.shift(); 
            }
        },

        _map: function (keyboardEvent) {
            var eventCode;

            if (!(keyboardEvent instanceof KeyboardEvent)) {
                throw new Error("keyboardEvent shloud be instance of KeyboardEvent"); 
            }
 
            switch (keyboardEvent.keyCode) {
                case 37:
                    eventCode = app.event.Object.LEFT;
                    break; 
                case 38:
                    eventCode = app.event.Object.UP;
                    break; 
                case 39:
                    eventCode = app.event.Object.RIGHT;
                    break; 
                case 40:
                    eventCode = app.event.Object.DOWN;
                    break; 
                case 87:
                    eventCode = app.event.Object.HIGH_PUNCH;
                    break; 
                case 83:
                    eventCode = app.event.Object.LOW_PUNCH;
                    break; 
                case 81:
                    eventCode = app.event.Object.HIGH_KICK;
                    break; 
                case 65:
                    eventCode = app.event.Object.LOW_KICK;
                    break; 
            }

            return [keyboardEvent.type, eventCode, +new Date()];
        }
    }
});
