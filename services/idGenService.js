var idGenService = function() {

    var uuid = require('node-uuid');

    return {
        generate: function() {
            var buffer = new Array(32);
            uuid.v4(null, buffer, 0);
            return uuid.unparse(buffer).substring(27);
        }
    }

}

module.exports = idGenService;