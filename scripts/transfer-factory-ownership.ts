import { ethers } from "hardhat";

// Existing deployments on Fuji
const FACTORY_ADDRESS = "0xcfEE6fE617C90FBDB38BB43231041b7b2a74999B";
const FORWARDER_ADDRESS = "0xb6f959A85949000bcc6cF1fC34231e8A1e87a26c";

async function main() {
  const factory = await ethers.getContractAt("ERC721CollectionFactory", FACTORY_ADDRESS);

  console.log("Current factory owner:", await factory.owner());

  const tx = await factory.transferOwnership(FORWARDER_ADDRESS);
  console.log("Transfer tx sent:", tx.hash);
  await tx.wait();

  console.log("New factory owner:", await factory.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
