import { ethers } from "hardhat";

// Existing deployment on Fuji
const COLLECTION_MANAGER_ADDRESS = "0xA0E7B3c996e54592C6B90DD1d1864c954074E4F7";

async function main() {
  const [deployer] = await ethers.getSigners();

  const Forwarder = await ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy(deployer.address, COLLECTION_MANAGER_ADDRESS);
  await forwarder.waitForDeployment();
  const forwarderAddress = await forwarder.getAddress();
  console.log("Forwarder deployed to:", forwarderAddress);

  console.log("\nDeployed addresses:");
  console.log({
    forwarderAddress,
    owner: deployer.address,
    caller: COLLECTION_MANAGER_ADDRESS,
  });

  console.log(
    "\nNOTE: For ERC721CollectionManager.createCollection() to actually work end-to-end, this Forwarder must be the owner of ERC721CollectionFactory (currently owned by the deployer wallet). That ownership transfer is a separate, deliberate step — not done here."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
