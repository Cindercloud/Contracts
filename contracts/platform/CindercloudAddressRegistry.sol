pragma solidity ^0.4.18;

import '../ownership/Ownable.sol';

contract CindercloudAddressRegistry  is Ownable {


    address[] public allowedContractsKeys;
    mapping(address => bool) public allowedContracts;

    modifier onlyAllowedContractOrOwner {
      if (allowedContracts[msg.sender] != true && msg.sender != owner) {
          revert();
      }
      _;
    }

    /**
     * Constructor
     */
    function CindercloudAddressRegistry() public {
    }

    mapping(address => string) addressCustomNames;

    function registerCustomName(address owner, string name) public onlyAllowedContractOrOwner {
        addressCustomNames[owner] = name;
    }

    function nameOf(address owner) view public returns (string name) {
        return addressCustomNames[owner];
    }

    /**
        Utility Methods
     */

    function addAllowedContracts(address[] addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            allowedContracts[addresses[i]] = true;
            allowedContractsKeys.push(addresses[i]);
        }
    }

    function removeAllowedContracts(address[] addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            allowedContracts[addresses[i]] = false;
        }
    }
}