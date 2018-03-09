var express = require('express');
var Address = require('./models/Address.js');
var bodyParser = require("body-parser");
var Mailgun = require('mailgun-js');
var Swagger = require('swagger-ui-express');
var docs = require('./docs/swagger.json');
var mongoose = require('mongoose');

//TODO: hide the next two values before commit
var api_key = "";
var domain = "";
var mailgun = new Mailgun({apiKey: api_key, domain: domain});

var connected = false;
mongoose.connect('mongodb://localhost/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  connected = true;
});

var MessageSchema = mongoose.Schema({
  subject: String,
  from: String,
  to: String,
  message: String
});
MessageSchema.methods.toString = function() {
  return "Subject: " + this.subject + "\nBody: " + this.message + "\n";
};
var Message = mongoose.model('Message', MessageSchema);


var app = express();

app.use('/api', Swagger.serve, Swagger.setup(docs));
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
    var addr = new Address(req.body.signature, req.body.from);
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
app.post('/inbox', function(req, res){
  console.log('/create_inbox called...');
  var addr = new Address(req.body.signature, req.body.address);
  if(addr.isValid(req.body.address)){
    //TODO: Change the description to the txid of the payment
    mailgun.post('/routes', {'priority': 0,
      'description': addr.location,
      'expression': 'match_recipient("' + addr.location + '")',
      //TODO: make the following field dynamic. (Maybe there's a free version that just forwards to your standard inbox)
      //This action could also be changed to notify another endpoint on mail receipt, that can store the emails in an s3 bucket or something
      'action': 'forward("http://dev.bip44mail.com/mail")'
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

app.post('/mail', function(req, res){
  //TODO: store the incoming message in a db
  console.log("/mail endpoint called with post.");
  var incoming_msg = new Message({
    subject: req.body['Subject'],
    to: req.body['To'],
    from: req.body['From'],
    message: req.body['body-plain']
  });
  if(connected){ //save the message to mongo if we're connected
    incoming_msg.save(function (err, data) {
      if(err){
        res.status(500).send(err);
        console.log("Error: " + err);
      } else{
        res.status(200).send(data);
        console.log(data);
      }
    });
  } else{
    res.status(500).send("Your server is not connected to a database.")
  }
});

app.get('/mail', function(req, res){
  //TODO: make this return all the mail received for a given address
  console.log("/mail endpoint called with get.");
  Message.find(function (err, messages) {
    if(err){
      res.status(500).send(err);
      console.log('Error: ' + err);
    } else{
      var test = messages[0].toString();
      //res.write();
      res.end(test);
      //res.status(200).send(test);
      console.log('Success: ' + test);
    }
  });
});

app.listen(3000);
console.log('Listening on port 3000...');