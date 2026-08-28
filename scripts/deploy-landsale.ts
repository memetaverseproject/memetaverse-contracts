import { ethers } from "hardhat";

// Existing deployments on Fuji
const LAND_ADDRESS = "";
const MTV_TOKEN_ADDRESS = "";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1. Deploy TestReferral (no args)
  const TestReferral = await ethers.getContractFactory("TestReferral");
  const referral = await TestReferral.deploy();
  await referral.waitForDeployment();
  const referralAddress = await referral.getAddress();
  console.log("TestReferral deployed to:", referralAddress);

  // 2. Deploy LandSale
  const pricePerLand = ethers.parseEther("10000");
  const referralCommision = 0;
  const startDate = Math.floor(Date.now() / 1000); // sale active immediately

  const LandSale = await ethers.getContractFactory("LandSale");
  const landSale = await LandSale.deploy(
    deployer.address, // _treasury
    LAND_ADDRESS, // _land
    MTV_TOKEN_ADDRESS, // _dealToken
    pricePerLand, // _pricePerLand
    referralAddress, // _referral
    referralCommision, // _referralCommision
    startDate // _startDate
  );
  await landSale.waitForDeployment();
  const landSaleAddress = await landSale.getAddress();
  console.log("LandSale deployed to:", landSaleAddress);

  console.log("\nDeployed addresses:");
  console.log({
    referralAddress,
    landSaleAddress,
    land: LAND_ADDRESS,
    dealToken: MTV_TOKEN_ADDRESS,
    treasury: deployer.address,
    pricePerLand: pricePerLand.toString(),
    referralCommision,
    startDate,
  });

  console.log(
    "\nNOTE: LandSale is not yet a registered minter on Land. Call Land.setMinter(landSaleAddress, true) as the Land owner before buy() will work."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
