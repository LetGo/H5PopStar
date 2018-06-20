var Globle = function() {
    this.init();
};

Globle.prototype.init = function() {

}

var ProxySingletonCreateGloble = (function() {
    var instance;
    return function() {
        if (!instance) {
            instance = new Globle();
        }
        return instance;
    }
})();
