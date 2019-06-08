const SigurnaNarudzba = artifacts.require("./SigurnaNarudzba.sol");

module.exports = function(deployer) {
  deployer.deploy(SigurnaNarudzba);
};
