var app = app || {};
app.core = app.core || {};

app.core.Object = function () {
    if (!(this instanceof arguments.callee)) {
        throw new Error("This is constructor! Use new key word!!!"); 
    }
    this.__event = {};
};

app.core.Object.define = function (name, definition) {
    if (!name) {
        throw new Error("You should define name"); 
    }

    var map         = name.split(".").slice(1);
    var namespace   = app;
    var constructor = map.pop();

    for (var i = 0, len = map.length; i < len; i++) {
      namespace = namespace[map[i]] = namespace[map[i]] || {};
    }

    namespace[constructor] = definition.constructor;

    if (definition.extend) {
        app.core.Object.extend(
            namespace[constructor],
            definition.extend
        );
    }

    if (definition.member) {
        app.core.Object.mixin(
            namespace[constructor],
            definition.member
        );
    }

    if (definition.static) {
        app.core.Object.static(
            namespace[constructor],
            definition.static
        );
    }
};

app.core.Object.extend = function (childConstructor, parentConstructor) {

    childConstructor.prototype = Object.create(parentConstructor.prototype);
    childConstructor.prototype.constructor = childConstructor;
    childConstructor.prototype.uper = parentConstructor;

    return childConstructor;
};

app.core.Object.mixin = function (targetConstructor /* ...mixins... */) {
    var i, member, mixin,
    mixins = Array.prototype.slice.call(arguments, 1),
    len    = mixins.length,
    targetPrototype = targetConstructor.prototype;

    if (len < 1) {
        throw new Error("There should be at least 1 element in mixins ");
    }

    for (i = 0; i < len; i += 1) {
        mixin = mixins[i];

        for (member in mixin) {
            if (targetPrototype[member])  {
                console.warn('Overrite memeber "' + member + '" which currently exists in prototype.');
            }
            targetPrototype[member] = mixin[member]; 
        }
    }

    return targetConstructor;
};

app.core.Object.static = function (targetConstructor /* ...mixins... */) {
    var i, member, static,
    statics = Array.prototype.slice.call(arguments, 1),
    len     = statics.length;

    if (len < 1) {
        throw new Error("There should be at least 1 element in mixins ");
    }

    for (i = 0; i < len; i += 1) {
        static = statics[i];

        for (member in static) {
            if (targetConstructor[member])  {
                console.warn('Overrite memeber "' + member + '" which currently exists in prototype.');
            }
            targetConstructor[member] = static[member]; 
        }
    }

    return targetConstructor;
};

app.core.Object.prototype = {
    getDocument: function () {
        return document; 
    },

    getWindow: function () {
        return window; 
    },

    addListener: function (name, fn, ctx /* args */) {
        var event = this.__event,
        ctxArgs = Array.prototype.slice.call(arguments, 2);

        if (!event[name]) {
            event[name] = []; 
        }

        event[name].push(Function.prototype.bind.apply(fn, ctxArgs));
    },

    existEvent: function (name) {
        if (!this.__event[name]) {
            return false;
        }

        return true;
    },

    fireEvent: function (name) {
        var i, len, event = this.__event[name];

        if (this.existEvent(name)) {
            for (i = 0, len = event.length; i < len; i += 1) {
                event[i]();
            }
        }
    },

    fireDataEvent: function (name, data) {
        var i, len, event = this.__event[name];

        if (this.existEvent(name)) {
            for (i = 0, len = event.length; i < len; i += 1) {
                event[i](data);
            } 
        }
    }
};
