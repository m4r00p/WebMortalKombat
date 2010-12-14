app.view.Object = function (model) {
    app.view.Object.prototype.super.apply(this, arguments);
    this._model = model;
};

app.core.Object.extend(
    app.view.Object,
    app.core.Object
);

app.core.Object.mixin(app.view.Object, {
    loadStylesheet: function (url) {
        var doc = this.getDocument(),
        link    = doc.createElement("link"),
        head    = doc.head;

		link.rel  = "stylesheet";
		link.type = "text/css";
		link.href = url;
        
        doc.head.appendChild(link);
    }
});
