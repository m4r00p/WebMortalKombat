app.Object = function () {
    this.__event = {};
};

app.Object.prototype.addListener = function (name, fn, ctx /* args */) {
    var event = this.__event,
    ctxArgs = Array.prototype.slice.call(arguments, 2);

    if (!event[name]) {
       event[name] = []; 
    }

    event[name].push(Function.prototype.bind.apply(fn, ctxArgs));
};

app.Object.prototype.existEvent = function (name) {
    if (!this.__event[name]) {
        throw new Error("Event not defined: [" + name + "]");
    }
};

app.Object.prototype.fireEvent = function (name) {
    var i, len, event = this.__event[name];

    this.existEvent(name);

    for (i = 0, len = event.length; i < len; i += 1) {
        event[i]();
    }
};

app.Object.prototype.fireDataEvent = function (name, data) {
    var i, len, event = this.__event[name];

    this.existEvent(name);

    for (i = 0, len = event.length; i < len; i += 1) {
        event[i](data);
    }
};
