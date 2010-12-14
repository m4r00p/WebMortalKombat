app.model.Object = function () {
    app.model.Object.prototype.super.apply(this, arguments);
};

app.core.Object.extend(
    app.model.Object,
    app.core.Object
);
