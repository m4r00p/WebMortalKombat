app.model.Character = function () {
    app.model.Character.prototype.super.apply(this, arguments);
};

app.core.Object.extend(
    app.model.Character,
    app.model.Object
);

app.core.Object.mixin(app.model.Character, {
    _name: 'subzero',

    _state: null,
    _stateList: ['stance', 'walk', 'backward', 'punch', 'kick', 'beinghit'],

    setState: function (newValue) {
        var oldValue = this._state;
        if (this._stateList.indexOf(newValue) === -1) {
            throw new Error("There is no such state on _stateList: [" + newValue + "] !!!")        
        }

        if (oldValue !== newValue) {
            this._state = newValue;
            this.fireDataEvent("changeState", [newValue, oldValue]); 
        }   
    },

    getState: function () {
        return this._state;
    },

    getName: function () {
        return this._name;
    },

    getFileName: function () {
        return  this._name + "-" + this._state;
    }
});
