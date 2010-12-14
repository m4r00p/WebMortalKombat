app.controller.Game = function () {
    var arenaModel      = new app.model.Arena();
    var arenaView       = new app.view.Arena(arenaModel);
    var arenaController = new app.controller.Arena(
        arenaModel,
        arenaView
    );

    this.__arena = arenaController; 

    var characterModel      = new app.model.Character();
    var characterView       = new app.view.character.Subzero(characterModel);
    var characterController = new app.controller.Character(
        characterModel,
        characterView
    );

    this.__character     = characterController;
    this.__characterView = characterView;
};

app.core.Object.extend(
    app.controller.Game,
    app.controller.Object
);

app.core.Object.mixin(app.controller.Game, {
    frameRateElement: null,
    frameRate: 0,
    toggleAnimate: true,
    updateLastTime: 0,

    run: function () {
        this.frameRateElement = document.getElementById('frame-rate');
        var toggleAnimate     = document.getElementById('toggle-animate');

        toggleAnimate.onclick = function () {
            this.toggleAnimate = !this.toggleAnimate;
        }.bind(this);

        this._registerListener();
        this._mainLoop();
    },

    _mainLoop: function () {
        var time = Date.now();

        if (this.toggleAnimate) {
            //this.__arena.update();
            this.__characterView.update(time);
        } 

        this.frameRate += 1;
        if (time - this.updateLastTime > 1000) {
            this.frameRateElement.innerHTML = this.frameRate + "fps";
            this.frameRate      = 0;
            this.updateLastTime = time;
        }

        setTimeout(this._mainLoop.bind(this), 0);
    },

    _onKeyDown: function (event) {
        this.__character.dispatch(new app.event.Keyboard(event)); 
    },

    _onKeyUp: function (event) {
        this.__character.dispatch(new app.event.Keyboard(event)); 
    },

    _registerListener: function () {
       var window = this.getWindow(); 
       
       window.addEventListener("keydown", this._onKeyDown.bind(this), false);
       window.addEventListener("keyup",   this._onKeyUp.bind(this),   false);
    } 
});
