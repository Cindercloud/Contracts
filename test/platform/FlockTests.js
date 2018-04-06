const expect = require('chai').expect;

const Flock = artifacts.require('./flock/Flock.sol');
const MintableToken = artifacts.require('./token/MintableToken.sol');

contract('Flock', function (accounts) {

	let flock;
	let token;

	beforeEach(async function () {
		token = await MintableToken.new();

		await token.mint(accounts[0], (1000000 * Math.pow(10, 18)));

		flock = await Flock.new();
	});

	it('should be possible to pay twice', async function () {
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[1], to: flock.address});
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[1], to: flock.address});

		let contribution = await flock.contributedBy.call(accounts[1]);
		expect(contribution.toNumber()).to.equal(2 * Math.pow(10, 18));
	});

	it('should correctly save contributions', async function () {
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[1], to: flock.address});

		let contribution = await flock.contributedBy.call(accounts[1]);
		expect(contribution.toNumber()).to.equal(1 * Math.pow(10, 18));
	});

	it('should be possible to enable withdrawals as owner', async function () {
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[1], to: flock.address});

		await token.transfer(flock.address, 1 * Math.pow(10, 18), {from: accounts[0]});

		await flock.enableWithdrawals(token.address, {from: accounts[0]});

		expect((await flock.token.call())).to.equal(token.address);
	});

	it('should not be possible to enable withdrawals as non-owner', async function () {
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[1], to: flock.address});

		await token.transfer(flock.address, 1 * Math.pow(10, 18), {from: accounts[0]});

		try {
			await flock.enableWithdrawals(token.address, {from: accounts[1]});
			assert.fail('shouldnt come here');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'Should have reverted'
			);
		}
	});

	it('should not be possible to claim tokens if you didn\'t invest', async function () {
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[0], to: flock.address});
		await token.transfer(flock.address, 1 * Math.pow(10, 18), {from: accounts[0]});
		await flock.enableWithdrawals(token.address, {from: accounts[0]});

		try {
			await flock.claimTokens({from: accounts[2]});
			assert.fail('shouldnt come here');
		} catch (error) {
			assert(
				error.message.indexOf('revert') >= 0,
				'Should have reverted'
			);
		}
	});

	it('should not be possible to claim twice', async function () {
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[1], to: flock.address});
		await web3.eth.sendTransaction({value: (1 * Math.pow(10, 18)), from: accounts[2], to: flock.address});

		await flock.enableWithdrawals(token.address, {from: accounts[0]});

		await flock.claimTokens({from: accounts[2]});
		await flock.claimTokens({from: accounts[2]});
	});

	it('should receive all tokens as sole investor', async function () {

		//user has no tokens
		expect((await token.balanceOf.call(accounts[4])).toNumber()).to.equal(0);

		//invest 1 ether
		let total_invested = (1 * Math.pow(10, 18));
		await web3.eth.sendTransaction({value: total_invested, from: accounts[4], to: flock.address});

		// transfer 2 tokens
		let all_tokens = (2 * Math.pow(10, 18));
		await token.transfer(flock.address, all_tokens, {from: accounts[0]});
		expect((await token.balanceOf.call(flock.address)).toNumber()).to.equal(all_tokens);


		//enable withdrawals
		await flock.enableWithdrawals(token.address, {from: accounts[0]});

		await flock.claimTokens({from: accounts[4]});

		let receivedBalance = await token.balanceOf.call(accounts[4]);
		expect(receivedBalance.toNumber()).to.equal(all_tokens);
	});

	it('should receive 25% of the tokens as investor of 25%', async function () {

		//user has no tokens
		expect((await token.balanceOf.call(accounts[1])).toNumber()).to.equal(0);
		expect((await token.balanceOf.call(accounts[2])).toNumber()).to.equal(0);
		expect((await token.balanceOf.call(accounts[3])).toNumber()).to.equal(0);
		expect((await token.balanceOf.call(accounts[4])).toNumber()).to.equal(0);

		//invest 1 ether
		let invested = (1 * Math.pow(10, 18));
		await web3.eth.sendTransaction({value: invested, from: accounts[1], to: flock.address});
		await web3.eth.sendTransaction({value: invested, from: accounts[2], to: flock.address});
		await web3.eth.sendTransaction({value: invested, from: accounts[3], to: flock.address});
		await web3.eth.sendTransaction({value: invested, from: accounts[4], to: flock.address});

		// transfer 2 tokens
		let all_tokens = (1 * Math.pow(10, 18));
		await token.transfer(flock.address, all_tokens, {from: accounts[0]});
		expect((await token.balanceOf.call(flock.address)).toNumber()).to.equal(all_tokens);

		//enable withdrawals
		await flock.enableWithdrawals(token.address, {from: accounts[0]});

		await flock.claimTokens({from: accounts[1]});

		let receivedBalance = await token.balanceOf.call(accounts[1]);
		expect(receivedBalance.toNumber()).to.equal(all_tokens / 4);
	});
});