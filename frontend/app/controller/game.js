app.controller.Game = function () {
    var arenaModel      = new app.model.Arena();
    var arenaView       = new app.view.Arena(arenaModel);
    var arenaController = new app.controller.Arena(
        arenaModel,
        arenaView
    );

    this.__arena = arenaController; 

    var characterModel      = new app.model.Character();
    var characterView       = new app.view.Character(characterModel);
    var characterController = new app.controller.Character(
        characterModel,
        characterView
    );

    this.__character = characterController;
};

app.controller.Game.prototype.mainLoop = function () {
    this.__arena.update();
    this.__character.update();

    setTimeout(this.mainLoop.bind(this), 0);
};

app.controller.Game.prototype.run = function () {
    //this.mainLoop();
};
