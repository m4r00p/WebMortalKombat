app.model.Character = function () {
    app.model.Character.superCtor.apply(this, arguments);

    setTimeout(function () {
        alert(1);

        this.fireDataEvent("changeCharacter", " data ");     
    }.bind(this), 1000);
};

app.inherit(
    app.model.Character,
    app.model.Object
);
