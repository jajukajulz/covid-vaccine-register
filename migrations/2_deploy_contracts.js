var VaccineRegistryArtifact = artifacts.require("VaccineRegistry");

module.exports = function (deployer) {
  deployer.deploy(VaccineRegistryArtifact);
};
