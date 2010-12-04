app.view.Object = function (view) {
    app.view.Object.superCtor.apply(this, arguments);

    this.__view  = view;
};

app.inherit(
    app.view.Object,
    app.Object
);

app.view.Object.prototype.update = function () {
    this.__view.update();
};
