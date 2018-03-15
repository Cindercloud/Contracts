//https://ethfiddle.com/uG0sm6z8EZ
contract Flock {

    using SafeMath for uint;

    uint256 collectedFunds;
    mapping(address => uint256) contributions;
    ERC20 token;
    uint percentage;



    function enableWithdrawals(address _tokenAddress) public {
        token = ERC20(_tokenAddress);

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