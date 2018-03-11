pragma solidity ^0.4.20;

import "https://github.com/GNSPS/solidity-bytes-utils/contracts/BytesLib.sol";

contract Inbox{
    struct Multihash{
        bytes1 version;
        bytes1 size;
        bytes32 ipfs_coords;
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
    mapping(uint => Multihash) messages;
    function addMessage(bytes _multihash)
    public
    returns(bool success) {
        uint messageID = numMessages++;
        messages[messageID] =Multihash(
            _multihash[0],
            _multihash[1],
            convertBytesToBytes32(BytesLib.slice(_multihash, 2, _multihash.length - 2)));
        return true;
    }

    function getMessages()
    public
    view
    returns(bytes1[], bytes1[], bytes32[]){
        bytes1[] memory versions = new bytes1[](numMessages);
        bytes1[] memory sizes = new bytes1[](numMessages);
        bytes32[] memory locations = new bytes32[](numMessages);
        for (uint i = 0; i < numMessages; i++) {
            Multihash storage mh = messages[i];
            versions[i] = mh.version;
            sizes[i] = mh.size;
            locations[i] = mh.ipfs_coords;
        }
        return(versions, sizes, locations);
    }
}