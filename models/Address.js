function Address(addr, pub_key){
    this.location = addr;
    this.pub_key = pub_key;
};

Address.prototype.isValid = function(){
    //TODO: add real logic
    //this method should attempt to verify the address via the public key provided

};
