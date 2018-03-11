pragma solidity ^0.4.16;
contract Message{
    address owner;
    Inbox creator;
    bytes32 from;
    bytes32 subject;
    bytes32 public message_body;

    function Message(bytes32 _from, bytes32 _subject, bytes32 _message_body)
    public {
        owner = msg.sender;
        creator = Inbox(msg.sender);
        from = _from;
        subject = _subject;
        message_body = _message_body;
    }
}

contract Inbox {
    address[] messages;
    function createMessage(bytes32 _from, bytes32 _subject, bytes32 _message_body)
    private
    returns(address message_address){
        return new Message(_from, _subject, _message_body);
    }
    function AddMessage(bytes32 _from, bytes32 _subject, bytes32 _message_body)
    external
    returns(address message_address) {
        address new_mail = createMessage(_from, _subject, _message_body);
        messages.push(new_mail);
        return new_mail;
    }
    function RetrieveMessage(Message _message)
    public
    view
    returns(bytes32 msg_body){
        return _message.message_body();
    }
}
