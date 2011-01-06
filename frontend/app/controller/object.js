app.controller.Object = function (model, view) {
    app.controller.Object.prototype.uper.apply(this, arguments);

    this._model = model;
    this._view  = view;
};

app.core.Object.extend(
    app.controller.Object,
    app.core.Object
);

app.core.Object.mixin(app.controller.Object, {
});
