pragma solidity ^0.4.18;

contract Ownable {
  address public owner = msg.sender;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function changeOwner(address _newOwner) public
  onlyOwner
  {
    require(_newOwner != 0x0);
    owner = _newOwner;
  }
}