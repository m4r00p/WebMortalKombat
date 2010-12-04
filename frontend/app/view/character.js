app.view.Character = function (model) {
    app.view.Character.superCtor.apply(this, arguments);   
};

app.inherit(
    app.view.Character,
    app.view.Object
);
