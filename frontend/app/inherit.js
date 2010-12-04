var app = {};

app.inherit = (function () {
    var temp = function () {};
    return  function (childCtor, parentCtor) {

        temp.prototype = parentCtor.prototype; 

        childCtor.prototype = new temp();
        childCtor.prototype.constructor = childCtor;
        childCtor.superCtor = parentCtor;

        return childCtor;
    };
}());
