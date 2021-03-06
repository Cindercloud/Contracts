pragma solidity ^0.4.19;


import '../ownership/Ownable.sol';
import '../math/SafeMath.sol';
import '../token/erc20/ERC20Basic.sol';

contract Flock is Ownable {

    using SafeMath for uint;

    uint256 public collectedFunds;
    mapping(address => Contribution) public contributions;
    ERC20Basic public token;
    uint public percentage;

    event Claimed(address indexed user, address token, uint256 amount);

    struct Contribution {
        uint256 amount;
        bool claimed;
    }

    function() public payable {
        //needs to be more than the minimum contribution
        require(msg.value > 0);
        if (contributions[msg.sender].amount == 0) {
            contributions[msg.sender] = Contribution(msg.value, false);
        } else {
            contributions[msg.sender].amount = contributions[msg.sender].amount.add(msg.value);
        }

        collectedFunds = collectedFunds.add(msg.value);
    }

    function claimTokens() public {
        //token needs to have been set
        require(address(token) != address(0));
        //should have had contributions
        require(contributions[msg.sender].amount > 0);
        //should not yet have been claimed
        require(!contributions[msg.sender].claimed);

        //set claimed to true first - reentrancy
        contributions[msg.sender].claimed = true;

        uint256 tokenAmount = _applyPct(contributions[msg.sender].amount, percentage);
        require(token.transfer(msg.sender, tokenAmount));
    }

    function enableWithdrawals(address _tokenAddress) public onlyOwner {
        require(collectedFunds > 0);

        token = ERC20Basic(_tokenAddress);

        uint allTokens = token.balanceOf(this);
        percentage = _toPct(allTokens, collectedFunds);
    }

    function contributedBy(address _funder) external view returns (uint256) {
        return contributions[_funder].amount;
    }

    function claimed(address _funder) external view returns (bool) {
        return contributions[_funder].claimed;
    }

    function _toPct(uint numerator, uint denominator) internal pure returns (uint) {
        return numerator.mul(10 ** 20) / denominator;
    }

    function _applyPct(uint numerator, uint pct) internal pure returns (uint) {
        return numerator.mul(pct) / (10 ** 20);
    }
}