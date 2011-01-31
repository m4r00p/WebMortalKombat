app.view.character.Object = function (model) {
    app.view.character.Object.prototype.uper.apply(this, arguments);   

    this._model.addListener('changeState', this._onChangeState, this);
    this._model.addListener('changeX', this._onChangeX, this);
    this._model.addListener('changeY', this._onChangeY, this);
    this._model.addListener('changeDirection', this._onChangeDirection, this);
};

app.core.Object.extend(
    app.view.character.Object,
    app.view.Object
);

app.view.character.Object.loadedState = null;

app.core.Object.mixin(app.view.character.Object, {
    __transitionInProgress: false,

    _calculateDistance: function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));  
    },

    _calculateDuration: function (x1, y1, x2, y2) {
        var distance = this._calculateDistance(x1, y1, x2, y2);
        var duration = distance/200;

        return duration; 
    },
    
    _onChangeDirection: function (data) {
        if (!this.element) {
            this.append();        
        }
        
        if (data[0] == "left") {
            this.addClass(this.element, "flip");
        } 
        else {
            this.removeClass(this.element, "flip");
        }
    },

    _onChangeState: function (data) {
        if (!this.element) {
            this.append();        
        }

        var fileName  = this._model.getFileName(),
        prevFileName  = this._model.getPrevFileName(),
        element       = this.element;

        if (!app.view.character.Object.loadedState) {
            app.view.character.Object.loadedState = [];
        }

        if (app.view.character.Object.loadedState.indexOf(data[0]) === -1) {
            this.loadStylesheet('css/' + fileName + '.css');
            app.view.character.Object.loadedState.push(data[0]);
        } 

        this.removeClass(element.firstChild, prevFileName + " " + prevFileName + "-linear");
        this.addClass(element.firstChild, fileName + " " + fileName + "-linear");
    },

    _onChangeX: function (data) {
        if (!this.element) {
            this.append();        
        }

        var x = data[0];
        var y = 0;
        var style     = this.element.style;
        var m = parseInt(this._model.getX(), 10);
        var n = parseInt(this._model.getY(), 10);
        //var m = parseInt(style.left, 10);
        //var n = parseInt(style.top, 10);
        //var duration  = this._calculateDuration(m, n, x, y) + "s";

        //style.webkitTransitionDuration = duration; 

        style.left = x + "px"; 
    },

    _onChangeY: function (data) {
        if (!this.element) {
            this.append();        
        }

        var x = 0;
        var y = data[0];
        var style     = this.element.style;
        var m = parseInt(this._model.getX(), 10);
        var n = parseInt(this._model.getY(), 10);
        //var m = parseInt(style.left, 10);
        //var n = parseInt(style.top, 10);
        //var duration  = this._calculateDuration(m, n, x, y) + "s";

        //style.webkitTransitionDuration = duration; 
        style.top  = y + "px"; 
    },

    remove: function () {
        this.element.parentNode.removeChild(this.element); 
    },

    append: function () {
        var doc = this.getDocument(),
        model   = this._model,
        outer   = doc.createElement('div'),
        inner   = doc.createElement('div');

        this.addClass(inner, 'character animated');
        this.addClass(outer, 'absolute transition-top-left');
        
        outer.appendChild(inner);
        
        this.element = outer;

        model.setState('stance');

        doc.body.firstChild.appendChild(outer);
    }
});
