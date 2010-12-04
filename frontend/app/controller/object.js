app.controller.Object = function (model, view) {
    app.controller.Object.superCtor.apply(this, arguments);

    this.__model = model;
    this.__view  = view;
};

app.inherit(
    app.controller.Object,
    app.Object
);

app.controller.Object.prototype.update = function () {
    this.__view.update();
};
