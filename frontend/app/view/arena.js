app.view.Arena = function (model) {
    app.view.Arena.prototype.uper.apply(this, arguments);

    this.append();
};

app.core.Object.extend(
    app.view.Arena,
    app.view.Object
);

app.core.Object.mixin(app.view.Arena, {
    append: function () {
        var doc = this.getDocument(),
        arena   = doc.createElement('div');

        arena.style.cssText = "position: absolute; background-image: url(asset/arena.png); " +
        "width: 100%; height: 254px; top: 0px; left: 0px;";

        doc.body.insertBefore(arena, doc.body.firstChild);
    }
});
