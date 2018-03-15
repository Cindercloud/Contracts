pragma solidity ^0.4.19;


import '../ownership/Ownable.sol';
import '../math/SafeMath.sol';
import '../token/erc20/ERC20Basic.sol';

contract Flock is Ownable {

    using SafeMath for uint;

    uint256 public collectedFunds;
    mapping(address => uint256) public contributions;
    ERC20Basic public token;
    uint public percentage;

    function() public payable {
        contributions[msg.sender] = msg.value;
        collectedFunds = collectedFunds.add(msg.value);
    }

    function claimTokens() public {
        require(contributions[msg.sender] > 0);

        token.transfer(msg.sender, _applyPct(contributions[msg.sender], percentage));
    }

    function enableWithdrawals(address _tokenAddress) public onlyOwner {
        require(collectedFunds > 0);

        token = ERC20Basic(_tokenAddress);

        uint allTokens = token.balanceOf(this);
        percentage = _toPct(allTokens, collectedFunds);
    }

    function _toPct(uint numerator, uint denominator) internal pure returns (uint) {
        return numerator.mul(10 ** 20) / denominator;
    }

    function _applyPct(uint numerator, uint pct) internal pure returns (uint) {
        return numerator.mul(pct) / (10 ** 20);
    }
}