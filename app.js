const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'books_db';

let db, collection;

// Create a new MongoClient
const client = new MongoClient(url, {
    useNewUrlParser: true
});
// initialising express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to mongodb server");
    db = client.db(dbName);
    // Get the documents collection
    collection = db.collection('book');

});

const findDocument = function (name, callback) {
    if (name === '') {
        collection.find({}).toArray(function (err, result) {
            assert.equal(err, null);
            console.log("found the following records");
            console.log(result);
            callback(result);
        });
    } else {
        var query = {
            "name": name
        };
        collection.find(query).toArray(function (err, result) {
            assert.equal(err, null);
            console.log("found the following records");
            console.log(result);
            callback(result);
        });
    }
}

const insertDocuments = function (data, callback) {
    // Insert some documents
    collection.insertMany([data], function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.insertedCount);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

const updateDocument = function (data, name, callback) {
    collection.updateOne({
        "name": name
    }, {
        $set: data
    }, function (err, result) {
        assert.equal(err, null);
        console.log("Updated the document");
        //console.log(result);
        callback(result.result);
    });
}

const deleteDocument = function (para, callback) {
    var query = { name : para };
    collection.deleteOne(query, function (err, result) {
        assert.equal(err, null);
        console.log("Document Deleted");
        callback(result);
    });
} 

app.get('/:name?', function (req, res) {
    if (req.params.name === undefined) {
        findDocument('', function (docs) {
        res.json(docs);
        });
    }
    else {
    var name = req.params.name;
    findDocument(name, function (result) {
        res.json(result);
    });
}
});

app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body));
    
    if (!req.body.name || !req.body.author_name || !req.body.price) {
        res.status(200).json({
            message: "Bad Request"
        });
    } else {
        let data = {
            name: req.body.name,
            author_name: req.body.author_name,
            price: req.body.price
        };

        console.log(data);

        insertDocuments(data, function (result) {
            res.json(result);
            console.log(result);
        });
    }
});

app.put('/:name', function (req, res) {
    console.log(JSON.stringify(req.body));
    var name = req.params.name;
    var data = {};

    for (var key in req.body) {
        data[key] = req.body[key];
    };


    updateDocument(data, name, function (result) {
        res.json(result);
        console.log(result);

    });
});

app.delete('/:name', function(req, res) {
    var para = req.params.name;
         deleteDocument(para, function (result) {
           res.json(result);
           console.log("Book " + para + " removed.");
     });
});

module.exports = app;