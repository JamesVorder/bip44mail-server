pragma solidity ^0.4.20;

import "https://github.com/GNSPS/solidity-bytes-utils/contracts/BytesLib.sol";

contract Inbox{
    struct Message{
        Multihash location;
    }
    struct Multihash{
        bytes1 version;
        bytes1 size;
        bytes32 location;
    }

    function convertBytesToBytes32(bytes inBytes)
    private
    pure
    returns (bytes32 outBytes32) {
        if (inBytes.length == 0) {
            return 0x0;
        }

        assembly {
            outBytes32 := mload(add(inBytes, 32))
        }
    }

    uint numMessages;
    mapping(uint => Message) messages;
    function addMessage(bytes _multihash)
    public
    returns(bool success) {
        uint messageID = numMessages++;
        messages[messageID] =
        Message(
            Multihash(
                _multihash[1],
                _multihash[2],
                convertBytesToBytes32(BytesLib.slice(_multihash, 3, _multihash.length - 3))));
        return true;
    }
}