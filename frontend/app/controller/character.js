app.controller.Character = function (model, view) {
    app.controller.Character.superCtor.apply(this, arguments);

    this.__model.addListener("changeCharacter", this.__onChangeCharacter, this, " prefix ");
};

app.inherit(
    app.controller.Character,
    app.controller.Object
);

app.controller.Character.prototype = {
    __onChangeCharacter: function (asdf, data) {

        alert(2);
        console.log("__onChangeCharacter", asdf, data); 
    }
};
