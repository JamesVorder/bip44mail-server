var util = require("ethereumjs-util");
var lightwallet = require("eth-lightwallet");

function Address(signature, msg, addr){
    this.location = addr;
    this.signature = JSON.parse(signature);
    this.msg = msg;
};

Address.prototype.isValid = function(){
     var v = this.signature.v;
     var r = this.signature.r;
     var s = this.signature.s;
     var result = lightwallet.signing.recoverAddress("hello world", v, util.toBuffer(r.data), util.toBuffer(s.data));
     console.log("Expected:\t" + this.location);
     console.log("Got:\t\t" + util.bufferToHex(result));
     return this.location == util.bufferToHex(result);
};

module.exports = Address;