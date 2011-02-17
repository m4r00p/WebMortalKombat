app.core.Object.define("app.controller.Object", {
    extend: app.core.Object,
    constructor: function (model, view) {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor

        this._model = model;
        this._view  = view;
    },
    static: {},
    member: {
        _model: null,
        _view: null
    }
});
