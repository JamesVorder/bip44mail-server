var express = require('express');
var api = require('./routes/api.js');

var app = express();

app.get('/mail/:publicKey/:address', function(req, res) {
    res.send(new Address(req.params.address, req.params.publicKey));
});

app.listen(3000);
console.log('Listening on port 3000...');