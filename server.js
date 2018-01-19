var express = require('express');
var Address = require('./models/Address.js');
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/validate', function(req, res) {
    var addr = new Address(req.body.signature, req.body.msg, req.body.address);
    var body = addr.isValid();
    console.log("Sending:\t" + JSON.stringify(body));
    return res.send(JSON.stringify(body));
});

app.listen(3000);
console.log('Listening on port 3000...');