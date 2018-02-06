var express = require('express');
var Address = require('./models/Address.js');
var bodyParser = require("body-parser");
var Mailgun = require('mailgun-js');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/validate', function(req, res) {
    var addr = new Address(req.body.signature, req.body.msg, req.body.address);
    var body = addr.isValid();
    console.log("Sending:\t" + JSON.stringify(body));
    return res.send(JSON.stringify(body));
});

app.post('/send', function(req, res){
    console.log("/send endpoint called.");
    //TODO: hide the next two values before commit
    var api_key = "##########";
    var domain = "bip44.email";
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});


    var data = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.message
    };

    mailgun.messages().send(data, function (err, body) {
        if (err) {
            //res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        else {
            //res.render('submitted', { email : to });
            console.log(body);
        }
    });
    //TODO: This stuff...
    //var addr = new Address(req.body.signature, req.body.address);
    //if(addr.isValid(req.body.message)){
    //
    //}
});

app.listen(3000);
console.log('Listening on port 3000...');