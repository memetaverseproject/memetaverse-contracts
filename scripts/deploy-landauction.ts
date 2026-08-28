import { ethers } from "hardhat";

// Existing deployments on Fuji
const LAND_ADDRESS = "0x947Db7d2B3B6D2Ea85c754970A17cB7F46577206";
const MTV_TOKEN_ADDRESS = "0x9d23B68De5CB977a43Df2d002083be5Dab1b74bD";
const REFERRAL_ADDRESS = "0xdD23b1219652CAFF0a436D3e3E5822426cd9dC10";

async function main() {
  const [deployer] = await ethers.getSigners();

  const startTime = Math.floor(Date.now() / 1000); // auction active immediately

  const DAY = 24 * 60 * 60;
  const discounts = [
    { duration: 2 * DAY, price: ethers.parseEther("20000") },
    { duration: 4 * DAY, price: ethers.parseEther("17500") },
    { duration: 6 * DAY, price: ethers.parseEther("15000") },
    { duration: 7 * DAY, price: ethers.parseEther("10000") },
  ];

  const LandDutchAuction = await ethers.getContractFactory("LandDutchAuction");
  const auction = await LandDutchAuction.deploy(
    LAND_ADDRESS, // _nft
    startTime, // _startTime
    deployer.address, // _treasury
    MTV_TOKEN_ADDRESS, // _dealToken
    REFERRAL_ADDRESS, // _referral
    discounts // _discounts
  );
  await auction.waitForDeployment();
  const auctionAddress = await auction.getAddress();
  console.log("LandDutchAuction deployed to:", auctionAddress);

  console.log("\nDeployed addresses:");
  console.log({
    auctionAddress,
    nft: LAND_ADDRESS,
    dealToken: MTV_TOKEN_ADDRESS,
    referral: REFERRAL_ADDRESS,
    treasury: deployer.address,
    startTime,
    discounts: discounts.map((d) => ({ duration: d.duration, price: d.price.toString() })),
  });

  console.log(
    "\nNOTE: LandDutchAuction is not yet a registered minter on Land. Call Land.setMinter(auctionAddress, true) as the Land owner before buy() will work."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
