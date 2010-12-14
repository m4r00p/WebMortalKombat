app.view.character.Subzero = function (model) {
    app.view.character.Subzero.prototype.super.apply(this, arguments);   
};

app.core.Object.extend(
    app.view.character.Subzero,
    app.view.character.Object
);

app.core.Object.mixin(app.view.character.Subzero, {

});
