pragma solidity ^0.4.0;
contract Message{
    address owner;
    Inbox creator;
    string from;
    string subject;
    string message_body;
    function Message(string _from, string _subject, string _message_body){
        owner = msg.sender;
        creator = Inbox(msg.sender);
        from = _from;
        subject = _subject;
        message_body = _message_body;
    }
}

contract Inbox {
    mapping(string => Message) public messages; //for now, I can map by subject... this isn't a unique identifier!
    //Message[] messages;
    function AddMessage(string _from, string _subject, string _message_body) external {
        new Message(_from, _subject, _message_body);
    }
}
