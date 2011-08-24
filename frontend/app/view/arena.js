app.core.Object.define("app.view.Arena", {
    extend: app.view.Object,
    constructor: function () {
        arguments.callee.prototype.uper.apply(this, arguments); //call parent constructor
        this.append();
    },
    statics: {},
    members: {
        append: function () {
            var doc = this.getDocument(),
            arena   = doc.createElement('div');

            arena.style.cssText = "position: absolute; background-image: url(asset/arena.png); " +
            "width: 100%; height: 254px; top: 0px; left: 0px;";

            doc.body.insertBefore(arena, doc.body.firstChild);
        }
    }
});
