var dbLog = function (mongoProvider) {

    var dateFormat = require('dateformat');

    return {

        log: function (entry) {
            var db = mongoProvider.getMongo();
            var collection = db.collection('logs');
            var logEntry = {
                'datetime': dateFormat(new Date()),
                'content': entry
            };
            collection.insert(logEntry, function (err, result) { });
        }
    }

};

module.exports = dbLog;
