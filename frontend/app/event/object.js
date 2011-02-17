app.core.Object.define("app.event.Object", {
    extend: app.core.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
    },
    static: {
        LEFT  : 1,
        RIGHT : 2,
        UP    : 3,
        DOWN  : 4,

        LOW_KICK    : 5,
        HIGH_KICK   : 6,
        LOW_PUNCH   : 7,
        HIGH_PUNCH  : 8
    },
    member: {}
});

