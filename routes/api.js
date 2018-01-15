var api = {};

api.get_mail = function(pub_key, candidate_addr){
    var addr = new Address(candidate_addr, pub_key);
    if(addr.isValid()){
        //return the emails (encrypted with the provided public key)
    } else{
        //kick
    }
};

api.create_inbox = function(addr, payment_addr, callback){
    //TODO: add real logic
    //add {addr, payment_addr} to pending DB
    //add listener for payment_addr transactions
    ////when payment)addr has sufficient balance
    //////add an email address for the given addr to our server
    //////remove {addr, payment_addr} from pending DB
    //TODO: What should this api return, since it's going to be remote (i.e. what about HTTP codes?)
    callback(undefined, addr + "@bip44mail.com");
};

module.exports = api;