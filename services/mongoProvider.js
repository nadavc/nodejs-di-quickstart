var mongoProvider = function () {

    var mongoClient = require('mongodb').MongoClient;
    var dbInstance;

    // Connect to the db
    mongoClient.connect('mongodb://localhost:27017/smartass', function (err, db) {
        if (!err) {
            dbInstance = db;
            console.log('Connected to mongo');
        } else {
            throw Error(err);
        }
    });

    return {
        getMongo: function () {
            return dbInstance;
        }
    }

};

module.exports = mongoProvider;
