const expect = require('chai').expect;

const CindercloudAddressRegistry = artifacts.require('./platform/CindercloudAddressRegistry.sol');

contract('CindercloudAddressRegistry', function (accounts) {

    let Registry;

    before(async function () {
        Registry = await CindercloudAddressRegistry.new();
    });

    it('should have correctly set the owner', async function() {
        let owner = await Registry.owner.call();
        expect(owner).to.equal(accounts[0]);
    });

    it('should not be possible to register as non-allowed-address or owner', async function() {
        let nonAllowedAccount = accounts[1];

        try {
            await Registry.registerCustomName(nonAllowedAccount, 'test', {from: nonAllowedAccount});
            assert.fail();            
        } catch(error) {
            assert(
                error.message.indexOf('revert') >= 0,
                'Should have reverted'
            );
        }
    });

    it('should be possible to register as owner', async function() {
        let allowedAccount = accounts[0];

        await Registry.registerCustomName(allowedAccount, 'test', {from: allowedAccount});

        let registeredName = await Registry.nameOf(accounts[0]);
        expect(registeredName).to.equal('test');
    });


    it('should be possible add allowed contracts as owner', async function() {
        await Registry.addAllowedContracts([accounts[3], accounts[4]], {from: accounts[0]});

        let allowed3 = await Registry.allowedContracts.call(accounts[3]);
        let allowed4 = await Registry.allowedContracts.call(accounts[4]);

        expect(allowed3).to.be.true;
        expect(allowed4).to.be.true;
    });

    it('should not be possible add allowed contracts as non-owner', async function() {
        
    });

    it('should be possible to register as allowed address', async function() {

    });

    it('it should overwrite if registered twice', async function() {
        
    });
});

