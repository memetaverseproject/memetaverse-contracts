import { ethers } from "hardhat";

// Existing MTVERC20 deployment on Fuji, used as the marketplace's accepted token
const MTV_TOKEN_ADDRESS = "0x9d23B68De5CB977a43Df2d002083be5Dab1b74bD";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1. Deploy RoyaltiesManager (no args)
  const RoyaltiesManager = await ethers.getContractFactory("RoyaltiesManager");
  const royaltiesManager = await RoyaltiesManager.deploy();
  await royaltiesManager.waitForDeployment();
  const royaltiesManagerAddress = await royaltiesManager.getAddress();
  console.log("RoyaltiesManager deployed to:", royaltiesManagerAddress);

  // 2. Deploy Marketplace, pointing at the RoyaltiesManager and MTV token above
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    deployer.address, // _owner
    deployer.address, // _feesCollector
    MTV_TOKEN_ADDRESS, // _acceptedToken
    royaltiesManagerAddress, // _royaltiesManager
    0, // _feesCollectorCutPerMillion
    0 // _royaltiesCutPerMillion
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  console.log("\nDeployed addresses:");
  console.log({
    royaltiesManagerAddress,
    marketplaceAddress,
    acceptedToken: MTV_TOKEN_ADDRESS,
    owner: deployer.address,
    feesCollector: deployer.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
