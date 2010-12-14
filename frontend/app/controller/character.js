app.controller.Character = function (model, view) {
    app.controller.Character.prototype.super.apply(this, arguments);

    //this.__model.addListener("changeCharacter", this.__onChangeCharacter, this, " prefix ");
};

app.core.Object.extend(
    app.controller.Character,
    app.controller.Object
);

app.core.Object.mixin(app.controller.Character, {
    dispatch: function (event) {
        var model = this._model;

        if (event.getType() == "keydown") {
            switch (event.getCode()) {
                case app.event.Object.LEFT:
                    model.setState('backward');
                    break; 
                case app.event.Object.UP:
                    break; 
                case app.event.Object.RIGHT:
                    model.setState('walk');
                    break; 
                case app.event.Object.DOWN:
                    break; 
                case app.event.Object.HIGH_PUNCH:
                    model.setState('punch');
                    break; 
                case app.event.Object.LOW_PUNCH:
                    model.setState('punch');
                    break; 
                case app.event.Object.HIGH_KICK:
                    model.setState('kick');
                    break; 
                case app.event.Object.LOW_KICK:
                    model.setState('kick');
                    break; 
            }
        }
    
        if (event.getType() == "keyup") {
            model.setState('stance');
        }
    }//,

    //idle: function () {},
    //victory: function () {},

    //moveForward: function () {},
    //moveBackward: function () {},

    //block: function () {},

    //highPunch: function () {},
    //lowPunch: function () {},
    //lowKick: function () {},
    //highKick: function () {},

    //jump: function () {},
    //jumpKick: function () {},
    //jumpPunch: function () {},

    //duck: function () {},
    //duckKick: function () {},
    //duckPunch: function () {},

    // down + hp
    //uppercut: function () {},
    //down + lp 
    //crouchPunch: function () {},
    // down + hk
    //crouchKick: function () {},
    // down + lk
    //ankleKick: function () {},
    // back + hk
    //roundhouse: function () {},
    // back + lk
    //sweep: function () {},

    // lp (close)
    //throwFlip: function () {},

    //turn: function () {}
});
