pragma solidity ^0.4.19;

//https://etherscan.io/address/0x5f9b61e7d7a7da4f8cd5f5c91eb935993e2d01ef#code

import '../ownership/Ownable.sol';
import '../math/SafeMath.sol';
import './Token.sol';

contract Flock {

    using SafeMath for uint;

    uint256 collectedFunds;
    mapping(address => uint256) contributions;
    Token token;
    uint percentage;

    function enableWithdrawals(address _tokenAddress) public {
        token = Token(_tokenAddress);

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