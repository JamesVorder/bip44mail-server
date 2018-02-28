var express = require('express');
var Address = require('./models/Address.js');
var bodyParser = require("body-parser");
var Mailgun = require('mailgun-js');

//TODO: hide the next two values before commit
var api_key = "key-529a4ff9954a7c2bbe511e8528bcd48f";
var domain = "bip44.email";
var mailgun = new Mailgun({apiKey: api_key, domain: domain});


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
    var addr = new Address(req.body.signature, req.body.address);
    if(addr.isValid(req.body.message)){
      console.log("Address was valid");
      var data = {
        from: req.body.from + "@" + domain,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.message
      };

      mailgun.messages().send(data, function (err, body) {
        if (err) {
          res.status(500).send(err);
          console.log("Error: ", err);
        }
        else {
          res.status(200).send(body);
          console.log("Success: " + body);
        }
      });
    }
});

//required fields: signature, address
app.post('/create_inbox', function(req, res){
  console.log('/create_inbox called...');
  var addr = new Address(req.body.signature, req.body.address);
  if(addr.isValid(req.body.address)){
    //TODO: Change the description to the txid of the payment
    mailgun.post('/routes', {'priority': 0,
      'description': addr.location,
      'expression': 'match_recipient("' + addr.location + '")',
      //TODO: make the following field dynamic. (Maybe there's a free version that just forwards to your standard inbox)
      //This action could also be changed to notify another endpoint on mail reciept, that can store the emails in an s3 bucket or something
      'action': 'forward("jamesvorder@gmail.com")'
    }, function(error, body){
      if(error){
        res.status(500).send(error);
        console.log("Error: " + error);
      } else{
        res.status(200).send(body);
        console.log("Success: " + JSON.stringify(body));
      }
    });
  }
});

app.listen(3000);
console.log('Listening on port 3000...');