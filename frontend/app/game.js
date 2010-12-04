app.Game = function () {
    this.animateObject = [];
};

app.Game.prototype.mainLoop = function () {
    setTimeout(this.mainLoop.bind(this), 0);
};

app.Game.prototype.run = function () {
    this.mainLoop();
};
