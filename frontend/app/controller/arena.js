app.core.Object.define("app.controller.Arena", {
    extend: app.controller.Object,
    constructor: function (model, view) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
    },
    static: {},
    member: {
        _model: null,
        _view: null
    }
});
