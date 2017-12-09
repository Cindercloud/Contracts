const CindercloudAddressRegistry = artifacts.require("./platform/CindercloudAddressRegistry.sol");

module.exports = function (deployer) {
  deployer.deploy(CindercloudAddressRegistry);
};