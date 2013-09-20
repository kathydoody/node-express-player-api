
/*
// Very basic node server - can be used for dev in any project

var http = require('http');

http.createServer(function (req,res) {
    res.writeHead(200,{'Context-Type' : 'text/plain'});
    res.end('Boston Sports Rock\n');
}).listen(3000, '127.0.0.1');
console.log('Server now running at 127.0.0.1:3000/');

*/

// the actual server with various routed endpoints

var express = require('express'),
    player = require('./routes/players');


var app = express();

app.configure(function(){
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

app.get('/players', player.findAll);
app.get('/players/:id', player.findById);
app.post('/players', player.addPlayer);
app.put('players/:id', player.updatePlayer);
app.delete('/players/:id', player.deletePlayer);

app.listen(3000);

console.log('Listening on port 3000...');