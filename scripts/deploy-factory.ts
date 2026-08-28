import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1. Deploy the ERC721Collection logic contract (base implementation, no args)
  const ERC721Collection = await ethers.getContractFactory("ERC721Collection");
  const collectionImpl = await ERC721Collection.deploy();
  await collectionImpl.waitForDeployment();
  const collectionImplAddress = await collectionImpl.getAddress();
  console.log("ERC721Collection (implementation) deployed to:", collectionImplAddress);

  // 2. Deploy the UpgradeableBeacon, pointing at the implementation above
  const UpgradeableBeacon = await ethers.getContractFactory("UpgradeableBeacon");
  const beacon = await UpgradeableBeacon.deploy(collectionImplAddress);
  await beacon.waitForDeployment();
  const beaconAddress = await beacon.getAddress();
  console.log("UpgradeableBeacon deployed to:", beaconAddress);

  // 3. Deploy the ERC721CollectionFactory, owned by the deployer, pointing at the beacon
  const ERC721CollectionFactory = await ethers.getContractFactory("ERC721CollectionFactory");
  const factory = await ERC721CollectionFactory.deploy(deployer.address, beaconAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("ERC721CollectionFactory deployed to:", factoryAddress);

  console.log("\nDeployed addresses:");
  console.log({
    collectionImplAddress,
    beaconAddress,
    factoryAddress,
    owner: deployer.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
