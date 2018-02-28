var util = require("ethereumjs-util");
var lightwallet = require("eth-lightwallet");

function Address(signature, addr){
    this.location = addr;
    this.signature = JSON.parse(signature);
};

Address.prototype.isValid = function(message){
     var v = this.signature.v;
     var r = this.signature.r;
     var s = this.signature.s;
     var result = lightwallet.signing.recoverAddress(message, v, util.toBuffer(r.data), util.toBuffer(s.data));
     console.log("Expected:\t" + this.location);
     console.log("Got:\t\t" + util.bufferToHex(result));
     return this.location == util.bufferToHex(result);
};

module.exports = Address;