const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'headsOfStateDB'; //db name
const collectioName = 'headsOfState'; // collection name

var headsOfStateDB;
var headsOfState;

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client) => {
        headsOfStateDB = client.db(dbName); // ref database
        headsOfState = headsOfStateDB.collection(collectioName) // ref collection
    })
    .catch((error) => {
        console.log(error)
    })

    // get heads function
    var getHeads = function() {
        return new Promise((resolve, reject) => {
            var cursor = headsOfState.find()
            cursor.toArray()
                .then((documents) => {
                    resolve(documents)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // add head of state function
    var addHeadOfState = function(_id, headOfState) {
        return new Promise((resolve, reject) => {
            headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    // exporting functions
    module.exports = { getHeads, addHeadOfState }