
var mongo = require('mongodb');

var Server = mongo.Server,
    DB = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true}, {safe:false});

db = new DB('playerdb', server);

db.open(function(err, db){
    if(!err){
        console.log("connected to playerdb");
        db.collection('players', {strict:true}, function(err, collection){
            if(err){
                console.log('the players collection doesnt exist. Creating now');
                populateDB();
            }
        });
    }
});

exports.findAll = function(req,res){
   // res.send([{firstname:'Dustin', lastname:'Pedroia'}, {firstname:'Tom', lastname:'Brady'}]);
    db.collection('players', function(err, collection){
        collection.find().toArray(function(err, items){
            res.send(items);
        });
    });
};

exports.findById = function(req, res){
    //res.send({id:req.params.id, firstname: 'First Name', lastname:'Last Name'});
    var id  = req.params.id;
    console.log('fetching player: '+ id);

    db.collection('players', function(err, collection){
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err,item){
            res.send(item);
        });
    });
};

exports.addPlayer = function(req, res){
    var player = req.body;
    console.log('Adding player: '+ JSON.stringify(player));

    db.collection('players', function(err, collection){
        collection.insert(player, {safe:true}, function(err, result){
            if(err) {
                res.send({'error':'error on insert'});
            } else {
                console.log('Insert completed: '+ JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updatePlayer = function(req, res){
    var id  = req.params.id;
    var player = req.body;

    console.log('updating player: ' + id);
    console.log(JSON.stringify(player));
    db.collection('players', function(err, collection){
        collection.update({'_id':new BSON.objectID(id)}, player, {safe:true}, function(err, result) {

            if(err) {
                res.send({'error':'error on update'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(player);
            }
        });
    });
};

exports.deletePlayer = function(req, res) {
    var id = req.params.id;
    console.log('Deleting player: ' + id);
    db.collection('players', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


var populateDB = function(){

    var players = [
        {
            "firstname": "Dustin",
            "lastname": "Pedroia",
            "team": "Redsox",
            "position": "2B",
            "age": "30"
        },
        {
            "firstname": "Zdeno",
            "lastname": "Chara",
            "team": "Bruins",
            "position": "D",
            "age": "37"
        }
    ];

    db.collection('players', function(err, collection) {
        collection.insert(players, {safe:true}, function(err, result) {});
    });
};




