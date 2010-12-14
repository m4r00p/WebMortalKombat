app.view.character.Object = function (model) {
    app.view.character.Object.prototype.super.apply(this, arguments);   

    this._model.addListener('changeState', this._onStateChange, this);

    this.append();
};

app.core.Object.extend(
    app.view.character.Object,
    app.view.Object
);

app.core.Object.mixin(app.view.character.Object, {
    _iteration     : 1, 
    _iterationStep : 1,
    _iterationMax  : 6, 
    _iterationDelay    : 100,  // ms
    _iterationLastTime : 0, // js timestamp

    _loadedState: null,

    _onStateChange: function (data) {
        var fileName  = this._model.getFileName();
        element       = this.element;

        if (!this._loadedState) {
            this._loadedState = [];
        }

        if (this._loadedState.indexOf(data[0]) === -1) {
            this.loadStylesheet('css/' + fileName + '.css');
            this._loadedState.push(data[0]);
        } 

        element.style.cssText += ";background-image: url(asset/character/" + fileName  + ".png);";
        element.className = fileName + "0" + this._iteration;
    },

    update: function (time) {
        var fileName  = this._model.getFileName();
        element       = this.element;

        if (this._iterationLastTime + this._iterationDelay < time) {
            element.className =  fileName + "0" + this._iteration;

            this._iteration        += this._iterationStep;
            this._iterationLastTime = time;

            if (this._iteration > this._iterationMax) {
                this._iteration = 1;
            }
        }
    },

    append: function () {
        var doc   = this.getDocument(),
        model     = this._model,
        character = doc.createElement('div');

        this.element = character;
        character.style.cssText = "position: absolute;";

        model.setState('stance');

        doc.body.appendChild(character);
    }
});
